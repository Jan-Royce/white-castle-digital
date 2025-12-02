import { ResourceBoard } from './ResourceBoard.js';

export class Player extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, player} = config;
        super(scene, x , y)
        this.id = player.id;
        this.player = player;
        this.scene.add.existing(this);

        this.lantern_card = []
        
        this.setUpPlayerBoard();
        this.resource_board.visible = false;
    }
    
    setUpPlayerDomainBoard(){
        
    }
    
    setUpPlayerBoard(){
        this.resource_board = new ResourceBoard({
            scene: this.scene,
            x: 0,
            y: 0,
            player: this.player
        });
    }
}