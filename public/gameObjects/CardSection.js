export class CardSection extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, color, action } = config;

        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.color = color;
        this.action = action;
        
        const sectionColor = color == 'black' ? 0xd13b15 : 0x1561ee;
        
        // TODO move interactivity to sprite
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, w, h, sectionColor);
        bg.setOrigin(0);
        bg.setAlpha(0);
        this.bg = bg;
        this.add(bg);
        
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerup', () => {
            console.log(this.color);
            console.log(this.action);
        });
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, w, h);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);
        this.zone = zone;
    }
    
    addHighlight() {
        this.bg.setAlpha(0.5);
        this.zone.disableInteractive();
    }

    removeHighlight() {
        this.bg.setAlpha(0);
        this.zone.setInteractive();
    }
}