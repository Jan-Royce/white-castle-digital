export class DieSpace extends Phaser.GameObjects.Sprite {
    constructor(config) {
        const { scene, x, y, size, value, color, maxCount, alwaysShow } = config;
        const texture = `dice${value}`;
        
        super(scene, x, y, texture);
        
        this.init_value = value;
        this.value = value;
        this.color = color ?? 'gray';
        this.max_count = maxCount;
        /**
         * dice example
         * 
         * {
         *   color: 'red'
         *   value: 4
         * }
         */
        this.dice = [];
        if(maxCount == Number.POSITIVE_INFINITY || this.dice.length == 0) this.setAlpha(0.55);
        
        this.setDisplaySize(size, size);
        this.setOrigin(0);
        this.tint = this.getColor(this.color);
        this.setInteractive({ useHandCursor: true });
        
        this.on('pointerup', () => {
            console.log(`${this.color} ${value}`);
        });
    }
    
    getColor(colorString) {
        const colors = {
            "red": 0xd47878,
            "black": 0x6e706b,
            "white": 0xfcf9f9,
            "green": 0xb7dda2,
            "gray": 0xbbbbbb
        };
        
        return colors[colorString];
    }
}