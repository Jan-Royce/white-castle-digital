import { DomainBoard } from './DomainBoard.js';
import { ResourceBoard } from './ResourceBoard.js';

export class Player extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, player} = config;
        super(scene, x , y)
        this.id = player.id;
        this.player = player;
        this.scene.add.existing(this);

        this.lantern_card = []
        
        this.player_board = new Phaser.GameObjects.Container(this.scene, 0, 0);

        this.setUpPlayerBoard();
        this.setUpPlayerDomainBoard();
        this.resource_board.visible = false;
        this.domain_board.visible = false;
        
        this.add(this.player_board);
    }
    
    // Player changes

    setUpPlayerDomainBoard(){
        this.domain_board = new DomainBoard({
            scene: this.scene,
            x: 0,
            y: 0,
            player: this.player 
        });
        this.player_board.add(this.domain_board);

    }
    
    setUpPlayerBoard(){
        this.resource_board = new ResourceBoard({
            scene: this.scene,
            x: 0,
            y: 0,
            player: this.player
        });
        this.player_board.add(this.resource_board);
    }
}