import { ResourceBoard } from './ResourceBoard.js';

export class Player extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, playerId} = config;
        super(scene, x , y)

        this.scene.add.existing(this);
        this.height = this.scene.scale.height;
        // this.width = this.scene.scale.width;

        this.lanternCard = []
        // this.setUpPlayerBoard();
    }

    setPlayerColor(){

    }

    setUpPlayerDomainBoard(){
        
    }

    setUpPlayerBoard(){
        this.resourceBoard = new ResourceBoard({
            scene: this.scene,
            x: 0,
            y: (this.height) / 2,
        });
    }
}