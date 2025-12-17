import { NetworkManager } from '../managers/NetworkManager.js';
import { Button } from '../components/Button.js';
import { Board } from '../gameObjects/Board.js';
import { Player } from '../gameObjects/Player.js';
import { RivalResourceBoard } from '../gameObjects/RivalResourceBoard.js';

import { EventManager } from '../managers/EventManager.js';
import { ActionManager } from '../managers/ActionManager.js';

export class Game extends Phaser.Scene
{
    constructor() {
        super('Game');
        this.rivals = {};
        this.rivals_list = null;
        this.game_started = false;
        this.player_board_depth = 2;
        this.main_board_depth = 1;
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
        
        const startBtn = new Button({
            scene: this,
            x: 0,
            y: 0,
            fontColor: '#fff',
            key1: 'start_red',
            key2: 'start_red_pressed',
            showBgColor: false,
            onClick: (btn) => {
                btn.destroy(true);
                socket.emit('start_game');
                this.game_started = true;
            }
        });
        startBtn.x = (this.scale.width - startBtn.zone.displayWidth) / 2;
        startBtn.y = (this.scale.height - startBtn.zone.displayHeight) / 2;

        socket.on('create_player', (player) => {
            this.player = new Player({
                scene: this,
                x: 0,
                y: 0,
                player: player
            });
            this.player.setDepth(this.player_board_depth);
        });
        
        socket.on('update_players', (playerData) => {
            playerCountTxt.setText(`Players (${Object.entries(playerData).length})`);
            if(this.game_started) {
                this.updateRivals(playerData);
            }
        });
        
        socket.on('start_game', () => {
            startBtn.destroy(true);
            this.game_started = true;
        });
        
        socket.on('board_setup', (board, players) => {
            if(typeof(this.board) !== 'undefined') this.board.destroy(true);
            this.player.resource_board.visible = true;
            
            this.board = new Board({
                scene: this, 
                x: 0,
                y: 0,
                boardData: board
            });
            this.player.setDepth(this.main_board_depth);

            this.addRivals(players);
            
            if(board.dev_mode) {
                const devTools = new Phaser.GameObjects.Container(this, 0, 0);
                const background = new Phaser.GameObjects.Rectangle(this, 0, 0, 160, 160, 0xd3d3d3);
                background.setOrigin(0);
                devTools.add(background);
                devTools.setAlpha(0.75);
                this.add.existing(devTools);
                
                const addTestUnits = new Button({
                    scene: this,
                    x: 0,
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
                addTestUnits.x = (background.displayWidth - addTestUnits.zone.displayWidth) / 2;
                
                const resetBtn = new Button({
                    scene: this,
                    x: 0,
                    y: 100,
                    w: 60,
                    h: 40,
                    fontSize: 16,
                    fontColor: '#000',
                    bgColor: '#cecc78',
                    text: "Reset",
                    parent: devTools,
                    onClick: (resetBtn) => {
                        resetBtn.destroy(true);
                        socket.emit('start_game');
                    }
                });
                resetBtn.x = (background.displayWidth - resetBtn.zone.displayWidth) / 2;
                
                socket.on('update_test_units', (board) => {
                    for(const item of this.board.castle.levels) {
                        if(item.space_id == "castle_gate") {
                            item.units = board.castle.levels[0].courtiers;
                            item.unit_space.destroy(true);
                            item.createUnitSpace();
                            item.updateUnitDisplay();
                        } else if(item.space_id == "castle_top") {
                            item.units = board.castle.levels[3].courtiers;
                            item.unit_space.destroy(true);
                            item.createUnitSpace();
                            item.updateUnitDisplay();
                            
                            let bonusIndex = 0;
                            for(const bonus of item.list) {
                                if(typeof (bonus.space_id) !== 'undefined') {
                                    bonus.units = board.castle.levels[3].bonus[bonusIndex].courtiers;
                                    bonus.unit_space.destroy(true);
                                    bonus.createUnitSpace();
                                    bonus.updateUnitDisplay();
                                    bonusIndex++;
                                }
                            }
                        } else {
                            for(const room of item.list) {
                                if(typeof(room.space_id) !== 'undefined') {
                                    room.units = board.castle.levels[room.floor_id].rooms[room.room_id].courtiers;
                                    room.unit_space.destroy(true);
                                    room.createUnitSpace();
                                    room.updateUnitDisplay();
                                }
                            }
                        }
                    }
                    
                    let i=0;
                    for(const item of this.board.yard.levels) {
                        item.units = board.yard[i].warriors;
                        item.unit_space.destroy(true);
                        item.createUnitSpace();
                        item.updateUnitDisplay();
                        i++;
                    }
                    
                    const bridgeOrder = ['red', 'black', 'white'];
                    for(const color of bridgeOrder) {
                        const plots = this.board.garden.garden_plots[color];
                        
                        plots[0].units = board.garden[color][0].gardeners;
                        plots[0].unit_space.destroy(true);
                        plots[0].createUnitSpace();
                        plots[0].updateUnitDisplay();
                        
                        plots[1].units = board.garden[color][1].gardeners;
                        plots[1].unit_space.destroy(true);
                        plots[1].createUnitSpace();
                        plots[1].updateUnitDisplay();
                    }
                });
                
                for(const resource of board.starting_lantern) {
                    this.player.addLanternReward(resource);
                }
            }
        });
        
        //NOTE: currently not used by anything
        socket.on('update_unit_display', () => {
            this.updateUnitDisplays();
        });
    }
    
    update() {
        
    }
    
    addRivals(players) {
        const rivalsWrap = new Phaser.GameObjects.Container(this, 0, 40);
        
        let yPos = 0;
        Object.entries(players).forEach(([id, player]) => {
            if(this.player.id != id) {
                const rival = new Player({
                    scene: this,
                    x: 0,
                    y: yPos,
                    player: player,
                    isRival: true
                });
                
                rival.resource_board.visible = true;
                this.rivals[id] = rival;
                rivalsWrap.add(rival);
                
                yPos += 100;
            }
        });
        
        this.rivals_list = rivalsWrap;
        this.add.existing(rivalsWrap);
    }
    
    updateRivals(playerData) {
        const currentRivals = Object.keys(this.rivals);
        const newRivals = Object.keys(playerData).filter((id) => id != this.player.id);
        
        const toRemove = currentRivals.filter((id) => !newRivals.includes(id));
        const toAdd = newRivals.filter((id) => !currentRivals.includes(id));
        
        for(const id of toRemove) {
            const rival = this.rivals[id];
            delete this.rivals[id];
            rival.destroy(true);
        }
        
        for(const id of toAdd) {
            const rival = new Player({
                scene: this,
                x: 0,
                y: 0,
                player: playerData[id],
                isRival: true
            });
            
            rival.resource_board.visible = true;
            this.rivals[id] = rival;
            this.rivals_list.add(rival);
        }
        
        let yPos = 0;
        for(const [id, rival] of Object.entries(this.rivals)) {
            rival.y = yPos;
            yPos += 100;
        }
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