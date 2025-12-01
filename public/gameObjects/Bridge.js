import { Dice } from './Dice.js';

export class Bridge extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, color, dice } = config;
        
        super(scene, x, y);
        
        this.dice_data = dice;
        this.dice = [];
        
        const colors = {
            "red": 0xce4c4c,
            "black": 0x454742,
            "white": 0xece9e9,
            "green": 0x92dd67
        };
        
        this.x = 20;
        const bridgeWidth = w;
        const bridgeHeight = h;
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, bridgeWidth, bridgeHeight, colors[color]);
        background.setOrigin(0);
        this.add(background);
        
        const sideOffset = 10;
        let xPos = sideOffset;
        const dieSize = 40;
        const yPos = (bridgeHeight - dieSize) / 2;
        const dieCount = dice.length;
        const spaceTotal = bridgeWidth - (dieCount * dieSize);
        const spaceBetween = (spaceTotal - (2 * sideOffset)) / (dieCount - 1);
        const offsetGrowth = dieSize + spaceBetween;
        
        for(let val of dice) {
            let die = new Dice({
                scene: this.scene,
                x: xPos,
                y: yPos,
                size: dieSize,
                value: val,
                color: color
            });
            
            this.dice.push(die);
            this.add(die);
            
            //dynamic spacing based on die count
            xPos += offsetGrowth;
        }
    }
}