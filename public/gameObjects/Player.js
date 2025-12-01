import { ResourceBoard } from './ResourceBoard.js';

export class Player extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, player} = config;
        super(scene, x , y)
        this.id = player.id;
        this.player = player;
        this.scene.add.existing(this);

        this.lanternCard = []
        // this.setUpPlayerBoard();
        this.setUpPlayerBoard();
        this.resourceBoard.visible = false;
    }
    
    setPlayerColor(){
        
    }
    
    setUpPlayerDomainBoard(){
        
    }
    
    setUpPlayerBoard(){
        this.resourceBoard = new ResourceBoard({
            scene: this.scene,
            x: 0,
            y: 0
        });
    }
}