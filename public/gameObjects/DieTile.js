export class DieTile extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, color, action } = config;

        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.color = color;
        this.action = action;
        this.tile_gap = 3;
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, w + this.tile_gap * 2, h + this.tile_gap * 2, 0xff501a);
        bg.setOrigin(0);
        bg.setAlpha(0);
        this.bg = bg;
        this.add(bg);
        
        const tile = new Phaser.GameObjects.Sprite(scene, this.tile_gap, this.tile_gap, `tile_${color}`);
        tile.setDisplaySize(w, h);
        tile.setOrigin(0);
        tile.setInteractive({ useHandCursor: true });
        this.add(tile);
        
        tile.on('pointerup', () => {
            console.log(this.color);
            console.log(this.action);
        });
        
        const zone = new Phaser.GameObjects.Zone(scene, this.tile_gap, this.tile_gap, w, h);
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