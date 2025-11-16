import { Dice } from './Dice.js';

export class Bridge extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, color, dice } = config;
        
        super(scene, x, y);
        this.scene = scene;
        
        this.dice_data = dice;
        this.dice = [];
        
        const colors = {
            "red": 0xce4c4c,
            "black": 0x454742,
            "white": 0xece9e9,
            "green": 0x92dd67
        };
        
        this.x = 20;
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, 280, 80, colors[color]);
        background.setOrigin(0);
        this.add(background);
        
        let xPos = 0;
        for(let val of dice) {
            let die = new Dice({
                scene: this.scene,
                x: xPos,
                y: 0,
                size: 60,
                value: val,
                color: color
            });
            
            this.dice.push(die);
            this.add(die);
            
            xPos += 70;
        }
    }
}