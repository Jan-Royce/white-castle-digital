import { Button } from '../components/Button.js';
import { Board } from '../gameObjects/Board.js';
import { Player } from '../gameObjects/Player.js';
import { RivalResourceBoard } from '../gameObjects/RivalResourceBoard.js';


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
        
        // let playerNames = [];
        
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

        socket.on('create_player', (player) => {
            this.player = new Player({
                scene: this,
                x: 0,
                y: 0,
                player: player
            });
            // console.log(this.player.id)
        });
        
        // socket.on('update_players', (playerData) => {
        //     this.players = playerData;
        //     playerCountTxt.setText(`Players (${Object.entries(this.players).length})`);
            
        //     for(let _playerName of playerNames) {
        //         _playerName.destroy();
        //     }
            
        //     let listY = 50;
        //     for (const [id, player] of Object.entries(this.players)) {
        //         let playerName = this.make.text(textConfig);
        //         playerNames.push(playerName);
                
        //         playerName.setText(id);
        //         playerName.setColor(player.color);
        //         playerName.y = listY;
                
        //         listY+=30;
        //     }
        // });
        
        socket.on('start_game', () => {
            startBtn.destroy();
        });
        
        socket.on('board_setup', (board, players) => {
            this.player.resource_board.visible = true;
            
            // this.board = new Board({
            //     scene: this, 
            //     x: 0,
            //     y: 0,
            //     boardData: board
            // });

            let gap = 0;
            Object.entries(players).forEach(([id, value]) => {
                // Handle the player leaving
                if(this.player.id != id){
                    this.rivalPlayers = new RivalResourceBoard({
                        scene: this, 
                        x: 0, 
                        y: 0, 
                        spacing: gap,
                        player: value
                    });
                    gap+=100;
                }
            });
        });
    }
    
    update() {
        
    }
}