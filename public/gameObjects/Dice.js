export class Dice extends Phaser.GameObjects.Sprite {
    constructor(config) {
        const { scene, x, y, size, value, color } = config;
        
        const texture = `dice${value}`;
        
        super(scene, x, y, texture);
        this.scene = scene;
        
        const colors = {
            "red": 0xd47878,
            "black": 0x6e706b,
            "white": 0xece9e9,
            "green": 0xb7dda2
        };
        
        this.value = value;
        this.color = color;
        
        this.setDisplaySize(size, size);
        this.setOrigin(0);
        this.tint = colors[color];
        this.setInteractive({ useHandCursor: true });
        
        //test interaction
        this.on('pointerup', () => {
            console.log(`${color} ${value}`);
        });
    }
}