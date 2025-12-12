import { ResourceBoard } from './ResourceBoard.js';
import { RivalResourceBoard } from './RivalResourceBoard.js';

export class Player extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, player, isRival } = config;
        
        super(scene, x , y);
        
        Object.assign(this, player);
        this.int_color = parseInt(this.color.replace(/^#/, ''), 16);
        this.is_rival = typeof(isRival) !== 'undefined' && isRival === true;
        
        this.lantern_card = []
        
        this.setUpPlayerBoard();
        this.resource_board.visible = false;
        
        this.scene.add.existing(this);
    }
    
    setUpPlayerDomainBoard() {
        
    }
    
    setUpPlayerBoard() {
        const resourceBoard = !this.is_rival ?
        new ResourceBoard({
            scene: this.scene,
            x: 0,
            y: 0,
            player: this
        }) :
        new RivalResourceBoard({
            scene: this.scene,
            x: 0,
            y: 0,
            player: this
        });
        
        this.add(resourceBoard);
        this.resource_board = resourceBoard;
    }
    
    updateResources(data) {
        /** source would be used to display icons for the resources source
         * ie well or lantern
         */
        const { resources, source, revert } = data;
        for(const [type, val] of Object.entries(resources)) {
            const amount = revert ? val * -1 : val;
            this.updateResource(type, amount);
        }
        
        this.updateResourceDisplay();
        
        if(!this.is_rival) this.scene.events.emit('player_update_resource', data);
    }
    
    updateResource(type, amount) {
        const basicResourceMax = 7;
        const daimyoMax = 5;
        
        switch(type) {
            case "food":
            case "iron":
            case "pearl":
                this[type] = Math.max(Math.min(this[type] + amount, basicResourceMax), 0);
                break;
            case "daimyo":
                this[type] = Math.max(Math.min(this[type] + amount, daimyoMax), 0);
                break;
            default:
                this[type] = Math.max(this[type] + amount, 0);
                break;
        }
    }
    
    updateResourceDisplay() {
        this.resource_board.updatePlayerResource();
    }
}