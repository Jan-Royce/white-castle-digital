import { Dice } from './Dice.js';

export class Bridge extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, board, color, dice } = config;
        
        super(scene, x, y);
        
        this.board = board;
        this.dice_data = this.formatDiceData(dice);
        this.dice = [];
        
        const colors = {
            "red": 0xce4e4e,
            "black": 0x464744,
            "white": 0xbebebe,
            "green": 0x8ccf65
        };
        
        this.x = 20;
        this.die_size = 40;
        this.die_side_offset = 10;
        this.bridge_width = w;
        this.bridge_height = h;
        this.die_ypos = (this.bridge_height - this.die_size) / 2;
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.bridge_width, this.bridge_height, colors[color]);
        background.setOrigin(0);
        this.add(background);
        
        const sideWidth = this.die_size + this.die_side_offset * 1.25;
        const bgWidth = background.displayWidth - (sideWidth * 2);
        
        const lightBg = new Phaser.GameObjects.Rectangle(scene, sideWidth, 0, bgWidth, this.bridge_height, 0xffffff);
        lightBg.setOrigin(0);
        lightBg.setAlpha(0.4);
        this.add(lightBg);
        
        let xPos = this.die_side_offset;
        const yPos = this.die_ypos;
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
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, this.bridge_width, this.bridge_height);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);
        this.zone = zone;
        
        zone.disableInteractive();
    }
    
    formatDiceData(data, end='left') {
        let formatted = data.filter(val => val > 0);
        
        if (formatted.length == 5) return data;
        
        switch(formatted.length) {
            case 4:
                formatted.splice(2, 0, 0);
                break;
            case 3:
                formatted.splice(1, 0, 0);
                formatted.splice(3, 0, 0);
                break;
            case 2:
                formatted = [formatted[0]].concat(Array(3).fill(0)).concat([formatted[1]]);
                break;
            case 1:
                if(end == 'left') {
                    formatted = Array(4).fill(0).concat(formatted);
                } else {
                    formatted = formatted.concat(Array(4).fill(0));
                }
                break;
        }
        
        return formatted;
    }
    
    removeDie(index, die) {
        const diceData = this.dice_data.filter(val => val > 0);
        
        diceData.splice(index, 1);
        this.dice_data = this.formatDiceData(diceData, index == 0 ? 'left' : 'right');
        this.dice.splice(index, 1);
        die.destroy(true);
        
        this.updateDice();
    }
    
    returnDie(index, die, dir) {
        let diceData = this.dice_data.filter(val => val > 0);
        
        if(index == 0) {
            diceData.splice(0, 0, die.value);
        } else {
            diceData.push(die.value);
        }
        this.dice_data = this.formatDiceData(diceData, dir);
        
        const returningDice = new Dice({
            scene: this.scene,
            x: 0,
            y: this.die_ypos,
            size: this.die_size,
            value: die.value,
            color: die.color,
            board: this.board,
            bridge: this
        });
        this.add(returningDice);
        
        this.dice.splice(index, 0, returningDice);
        this.updateDice();
    }
    
    updateDice() {
        let xPos = this.die_side_offset;
        const dieCount = this.dice_data.length;
        const spaceTotal = this.bridge_width - (dieCount * this.die_size);
        const spaceBetween = (spaceTotal - (2 * this.die_side_offset)) / (dieCount - 1);
        const offsetGrowth = this.die_size + spaceBetween;
        
        /**
         * NOTE: dice_data was used instead of dice to consider empty spaces especially when
         * the only remaining die is on the right side instead of left
         */
        let diceIndex = 0;
        for(let i=0; i<this.dice_data.length; i++) {
            if(this.dice_data[i] == 0) {
                xPos += offsetGrowth;
                continue;
            }
            const die = this.dice[diceIndex];
            
            die.x = xPos;
            
            if(diceIndex==0 || diceIndex==this.dice.length-1) {
                die.can_take = true;
                die.die.input.cursor = 'pointer';
            } else {
                die.can_take = false;
                die.die.input.cursor = 'not-allowed';
            }
            
            diceIndex++;
            xPos += offsetGrowth;
        }
    }
}