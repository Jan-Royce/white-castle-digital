export class DieSpace extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, size, value, color, maxCount, alwaysShow } = config;
        const texture = `dice${value}`;
        
        super(scene, x, y);
        
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
        this.color_restrictions = [];
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, size, size, 0xff501a);
        bg.setOrigin(0);
        bg.setAlpha(0);
        this.bg = bg;
        this.add(bg);
        
        const die = new Phaser.GameObjects.Sprite(this.scene, 0, 0, texture);
        this.die = die;
        this.add(die);
        
        if(maxCount == Number.POSITIVE_INFINITY || this.dice.length == 0) die.setAlpha(0.55);
        
        die.setDisplaySize(size, size);
        die.setOrigin(0);
        die.tint = this.getColor(this.color);
        die.setInteractive({ useHandCursor: true });
        
        die.on('pointerup', () => {
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
    
    addHighlight() {
        this.bg.setAlpha(1);
    }
    
    removeHighlight() {
        this.bg.setAlpha(0);
    }
}