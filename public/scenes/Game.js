import { NetworkManager } from '../managers/NetworkManager.js';
import { Button } from '../components/Button.js';
import { Board } from '../gameObjects/Board.js';
import { EventManager } from '../managers/EventManager.js';
import { ActionManager } from '../managers/ActionManager.js';

export class Game extends Phaser.Scene
{
    constructor() {
        super('Game');
        this.players = {};
    }
    
    create() {
        const socket = io();
        
        // TODO after merging to dev, move all socket events to either of the managers here
        const networkManager = new NetworkManager(this, socket);
        const eventManager = new EventManager(this);
        const actionManager = new ActionManager(this);
        
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
        
        socket.on('board_setup', (board) => {
            if(typeof(this.board) !== 'undefined') this.board.destroy();
            this.board = new Board({
                scene: this, 
                x: 0,
                y: 0,
                boardData: board
            });
            
            if(board.dev_mode) {
                const devTools = new Phaser.GameObjects.Container(this, 0, 0);
                const background = new Phaser.GameObjects.Rectangle(this, 0, 0, 160, 160, 0xd3d3d3);
                background.setOrigin(0);
                devTools.add(background);
                devTools.setAlpha(0.75);
                this.add.existing(devTools);
                
                
                const devButtonsX = 80;
                
                const AddTestUnits = new Button({
                    scene: this,
                    x: devButtonsX,
                    y: 40,
                    w: 140,
                    h: 40,
                    fontSize: 12,
                    fontColor: '#000',
                    bgColor: '#cecc78',
                    text: "Update Test Units",
                    parent: devTools,
                    onClick: () => {
                         socket.emit('display_test_units');
                    }
                });
                
                const resetBtn = new Button({
                    scene: this,
                    x: devButtonsX,
                    y: 100,
                    w: 60,
                    h: 40,
                    fontSize: 16,
                    fontColor: '#000',
                    bgColor: '#cecc78',
                    text: "Reset",
                    parent: devTools,
                    onClick: (resetBtn) => {
                        resetBtn.destroy();
                        socket.emit('start_game');
                    }
                });
                
                socket.on('update_test_units', (board) => {
                    for(const item of this.board.castle.levels) {
                        if(item.space_id == "castle_gate") {
                            item.units = board.castle.levels[0].courtiers;
                            item.unit_space.destroy();
                            item.createUnitSpace();
                            item.updateUnitDisplay();
                        } else if(item.space_id == "castle_top") {
                            item.units = board.castle.levels[3].courtiers;
                            item.unit_space.destroy();
                            item.createUnitSpace();
                            item.updateUnitDisplay();
                            
                            let bonusIndex = 0;
                            for(const bonus of item.list) {
                                if(typeof (bonus.space_id) !== 'undefined') {
                                    bonus.units = board.castle.levels[3].bonus[bonusIndex].courtiers;
                                    bonus.unit_space.destroy();
                                    bonus.createUnitSpace();
                                    bonus.updateUnitDisplay();
                                    bonusIndex++;
                                }
                            }
                        } else {
                            for(const room of item.list) {
                                if(typeof(room.space_id) !== 'undefined') {
                                    room.units = board.castle.levels[room.floor_id].rooms[room.room_id].courtiers;
                                    room.unit_space.destroy();
                                    room.createUnitSpace();
                                    room.updateUnitDisplay();
                                }
                            }
                        }
                    }
                    
                    let i=0;
                    for(const item of this.board.yard.levels) {
                        item.units = board.yard[i].warriors;
                        item.unit_space.destroy();
                        item.createUnitSpace();
                        item.updateUnitDisplay();
                        i++;
                    }
                    
                    const bridgeOrder = ['red', 'black', 'white'];
                    for(const color of bridgeOrder) {
                        const plots = this.board.garden.garden_plots[color];
                        
                        plots[0].units = board.garden[color][0].gardeners;
                        plots[0].unit_space.destroy();
                        plots[0].createUnitSpace();
                        plots[0].updateUnitDisplay();
                        
                        plots[1].units = board.garden[color][1].gardeners;
                        plots[1].unit_space.destroy();
                        plots[1].createUnitSpace();
                        plots[1].updateUnitDisplay();
                    }
                });
            }
        });
        
        //NOTE: currently not used by anything
        socket.on('update_unit_display', () => {
            this.updateUnitDisplays();
        });
    }
    
    update() {
        
    }
    
    updateUnitDisplays() {
        for(const item of this.board.castle.levels) {
            if (item.space_id == "castle_gate") {
                item.updateUnitDisplay();
            } else if (item.space_id == "castle_top") {
                item.updateUnitDisplay();
                for (const bonus of item.list) {
                    if (typeof (bonus.space_id) !== 'undefined') {
                        bonus.updateUnitDisplay();
                    }
                }
            } else {
                for (const room of item.list) {
                    if (typeof (room.space_id) !== 'undefined') {
                        room.updateUnitDisplay();
                    }
                }
            }
        }
        
        for(const item of this.board.yard.levels) {
            item.updateUnitDisplay();
        }
        
        const bridgeOrder = ['red', 'black', 'white'];
        for (const color of bridgeOrder) {
            const plots = this.board.garden.garden_plots[color];
            
            plots[0].updateUnitDisplay();
            plots[1].updateUnitDisplay();
        }
    }
}