export class Game extends Phaser.Scene
{
    constructor() {
        super('Game');
        this.players = {};
    }
    
    create() {
        const socket = io();
        socket.on('lobby_full', () =>{
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
                color: '#ffffff',
            },
            add: true
        };
        
        let playerCountTxt = this.make.text(textConfig);
        playerCountTxt.setText("Players (0)");
        
        let playerNames = [];
        
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
    }
    
    update() {
        
    }
}