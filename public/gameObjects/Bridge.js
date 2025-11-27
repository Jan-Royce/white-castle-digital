import { Dice } from './Dice.js';

export class Bridge extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, color, dice } = config;
        
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
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, 290, 80, colors[color]);
        background.setOrigin(0);
        this.add(background);
        
        let xPos = 0;
        let dieSize = 50;
        let dieSpace = Math.ceil(290 / dice.length / 10) * 10;
        
        for(let val of dice) {
            let die = new Dice({
                scene: this.scene,
                x: xPos,
                y: 16,
                size: dieSize,
                value: val,
                color: color
            });
            
            this.dice.push(die);
            this.add(die);
            
            //dynamic spacing based on die count
            xPos += dieSpace;
        }
    }
}