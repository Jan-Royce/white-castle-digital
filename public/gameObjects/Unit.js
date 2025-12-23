export class Unit extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, size, color, type, count, showCount, boardSpace } = config;

        super(scene, x, y);
        
        this.size = size;
        this.color = color;
        this.type = type;
        this.count = count;
        this.count_show = showCount;
        this.board_space = boardSpace;
        
        const spriteBg = new Phaser.GameObjects.Rectangle(scene, 0, 0, size, size, 0x00ffea);
        spriteBg.setOrigin(0);
        spriteBg.setAlpha(0);
        this.bg = spriteBg;
        
        const sprite = new Phaser.GameObjects.Sprite(scene, 0, 0, `unit_${type}`);
        sprite.setDisplaySize(size, size);
        sprite.setTint(color);
        sprite.setOrigin(0);
        this.add(sprite);
        
        if(showCount) {
            const unitCount = new Phaser.GameObjects.Text(scene, size / 4 + 2, size / 4, count, {
                fontSize: `${size / 2}px`,
                fontStyle: 'bold',
                color: '#000'
            });
            unitCount.setStroke('#fff', 4);
            unitCount.setOrigin(0);
            this.add(unitCount);
        }
        
        sprite.setInteractive({ useHandCursor: true });
        
        sprite.on('pointerup', () => {
            console.log(this.type);
        });
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, size, size);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);
        this.zone = zone;
    }
    
    addHighlight() {
        this.bg.setAlpha(1);
        this.zone.disableInteractive();
    }

    removeHighlight() {
        this.bg.setAlpha(0);
        this.zone.setInteractive();
    }
}