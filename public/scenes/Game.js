import { Button } from '../components/Button.js';
import { Board } from '../gameObjects/Board.js';
import { PlayerResourceBoard } from '../gameObjects/PlayerResourceBoard.js';


export class Game extends Phaser.Scene
{
    constructor() {
        super('Game');
        this.players = {};
    }
    
    create() {
        const socket = io();
        
        socket.on('lobby_full', () => {
                this.add.text(20,50, "Server is Full\nTry Again Later", {
                fontSize: "30px",
                color: "#ff0000",
            });
        });

        let textConfig = {
            x: 20,
            y: 20,
            text: '',
            style: {
                fontSize: '20px',
                fontFamily: 'Arial',
                color: '#000',
            },
            add: true
        };
        
        let playerCountTxt = this.make.text(textConfig);
        playerCountTxt.setText("Players (0)");
        
        let playerNames = [];
        
        const startBtn = new Button({
            scene: this,
            x: this.scale.width / 4,
            y: 100,
            fontColor: '#fff',
            key1: 'start_red',
            key2: 'start_red_pressed',
            onClick: (btn) => {
                btn.destroy();
                socket.emit('start_game');
            }
        });
        
        socket.on('update_players', (playerData) => {
            this.players = playerData;
            
            playerCountTxt.setText(`Players (${Object.entries(this.players).length})`);
            
            for(let _playerName of playerNames) {
                _playerName.destroy();
            }
            
            let listY = 50;
            for (const [id, player] of Object.entries(this.players)) {
                let playerName = this.make.text(textConfig);
                playerNames.push(playerName);
                
                playerName.setText(id);
                playerName.setColor(player.color);
                playerName.y = listY;
                
                listY+=30;
            }
        });
        
        socket.on('start_game', () => {
            startBtn.destroy();
        });
        
        socket.on('board_setup', (board, players) => {
            this.board = new Board({
                scene: this, 
                x: 0,
                y: 0,
                boardData: board
            });
            this.player = new PlayerResourceBoard({
                scene: this,
                x: 0,
                y: (this.scale.height / 2) - 30,
                playerData: players
            });
        });
    }
    
    update() {
        
    }
}