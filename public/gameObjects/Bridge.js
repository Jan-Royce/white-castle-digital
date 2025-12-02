import { Dice } from './Dice.js';

export class Bridge extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, board, color, dice } = config;
        
        super(scene, x, y);
        
        this.board = board;
        this.dice_data = dice;
        this.dice = [];
        
        const colors = {
            "red": 0xce4c4c,
            "black": 0x454742,
            "white": 0xece9e9,
            "green": 0x92dd67
        };
        
        this.x = 20;
        this.die_size = 40;
        this.die_side_offset = 10;
        this.bridge_width = w;
        this.bridge_height = h;
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.bridge_width, this.bridge_height, colors[color]);
        background.setOrigin(0);
        this.add(background);
        
        const bgWidth = this.die_size + this.die_side_offset * 1.25;
        
        const leftBg = new Phaser.GameObjects.Rectangle(scene, 0, 0, bgWidth, this.bridge_height, 0x000000);
        leftBg.setOrigin(0);
        leftBg.setAlpha(0.25);
        this.add(leftBg);
        
        const rightBg = new Phaser.GameObjects.Rectangle(scene, (this.bridge_width - bgWidth), 0, bgWidth, this.bridge_height, 0x000000);
        rightBg.setOrigin(0);
        rightBg.setAlpha(0.25);
        this.add(rightBg);
        
        let xPos = this.die_side_offset;
        const yPos = (this.bridge_height - this.die_size) / 2;
        const dieCount = dice.length;
        const spaceTotal = this.bridge_width - (dieCount * this.die_size);
        const spaceBetween = (spaceTotal - (2 * this.die_side_offset)) / (dieCount - 1);
        const offsetGrowth = this.die_size + spaceBetween;
        
        for(let i=0; i<dice.length; i++) {
            const val = dice[i];
            
            let die = new Dice({
                scene: this.scene,
                x: xPos,
                y: yPos,
                size: this.die_size,
                value: val,
                color: color,
                board: this.board,
                bridge: this
            });
            
            if(i==0 || i==dice.length-1) {
                die.can_take = true;
                die.die.input.cursor = 'pointer';
            } else {
                die.die.input.useHandCursor = false;
                die.die.input.cursor = 'not-allowed';
            }
            
            this.dice.push(die);
            this.add(die);
            this.board.dice.push(die);
            
            xPos += offsetGrowth;
        }
    }
    
    removeDie(index, die) {
        this.dice_data.splice(index, 1);
        this.dice.splice(index, 1);
        die.destroy();
        this.updateDice();
    }
    
    updateDice() {
        let xPos = this.die_side_offset;
        const dieCount = this.dice.length;
        const spaceTotal = this.bridge_width - (dieCount * this.die_size);
        const spaceBetween = (spaceTotal - (2 * this.die_side_offset)) / (dieCount - 1);
        const offsetGrowth = this.die_size + spaceBetween;
        
        for(let i=0; i<this.dice.length; i++) {
            const die = this.dice[i];
            die.x = xPos;
            
            if(i==0 || i==this.dice.length-1) {
                die.can_take = true;
                die.die.input.cursor = 'pointer';
            } else {
                die.die.input.useHandCursor = false;
                die.die.input.cursor = 'not-allowed';
            }
            
            xPos += offsetGrowth;
        }
    }
}