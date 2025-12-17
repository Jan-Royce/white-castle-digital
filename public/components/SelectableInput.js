export class SelectableInput extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, spr, imgScale, bgColor, action } = config;

        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.spr = spr;
        this.img_scale = imgScale ?? 1;
        this.bg_color = bgColor ?? "#c7c7c7";
        this.bg_color = parseInt(this.bg_color.replace(/^#/, ''), 16);
        this.selected = false;
        this.action = action;
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.w, this.h, this.bg_color);
        bg.setOrigin(0);
        this.bg = bg;
        
        const img = new Phaser.GameObjects.Sprite(scene, 0, 0, spr);
        img.setOrigin(0);
        img.setScale(this.img_scale);
        img.x = (this.w - img.displayWidth) / 2;
        img.y = (this.h - img.displayHeight) / 2;
        
        this.add(bg);
        this.add(img);
        
        bg.setInteractive({ useHandCursor: true });
        
        bg.on('pointerup', () => {
            this.selected = true;
            this.select();
            
            //TODO continue here
        });
    }
    
    select() {
        this.bg.setFillStyle(0x28d1ac);
    }
    
    deselect() {
        this.bg.setTint(this.bg_color);
    }
}