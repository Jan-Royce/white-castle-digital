export class Button extends Phaser.GameObjects.Container {
    constructor(config) {
        // TODO add transparent image support
        const { scene, x, y, w, h, fontSize, fontColor, bgColor, key1, key2, imgScale, showBgColor, text, onClick, parent } = config;
        
        super(scene, x, y);
        
        this.font_color = fontColor ?? "#000";
        this.font_size = fontSize ?? 28;
        this.bg_color = bgColor ?? "#c7c7c7";
        this.gfx = null;
        this.show_bg_color = typeof(showBgColor) === 'undefined' || showBgColor == true;
        this.w = w ?? 100;
        this.h = h ?? 50;
        this.img_scale = imgScale ?? 1;
        
        const buttonZone = new Phaser.GameObjects.Zone(scene, 0, 0, this.w, this.h);
        buttonZone.setOrigin(0);
        
        if(this.show_bg_color) {
            const color = parseInt(this.bg_color.replace(/^#/, ''), 16);
            const buttonBg = new Phaser.GameObjects.Rectangle(scene, 0, 0, buttonZone.width, buttonZone.height, color);
            buttonBg.setOrigin(0);
            this.add(buttonBg);
            this.button_bg = buttonBg;
        }
        
        if(typeof(key1) !== 'undefined') {
            const gfx = new Phaser.GameObjects.Sprite(scene, 0, 0, key1);
            gfx.setOrigin(0);
            gfx.setScale(this.img_scale);
            this.add(gfx);
            this.gfx = gfx;
            
            gfx.x = (this.w - gfx.displayWidth) / 2;
            gfx.y = (this.h - gfx.displayHeight) / 2;
            
            if(this.show_bg_color) {
                this.button_bg.width = buttonZone.width;
                this.button_bg.height = buttonZone.height;
            }
        }
        
        const buttonText = this.scene.add.text(0, 0, text ?? '', {
            fontSize: `${this.font_size}px`, color: this.font_color
        });
        buttonText.x = (buttonZone.displayWidth - buttonText.displayWidth) / 2;
        buttonText.y = (buttonZone.displayHeight - buttonText.displayHeight) / 2;
        
        this.add(buttonZone);
        buttonZone.setInteractive({ useHandCursor: true });
        
        this.add(buttonText);
        
        this.zone = buttonZone;
        this.button_text = buttonText;
        
        buttonZone.on('pointerdown', () => {            
            if (typeof(key2) !== 'undefined') this.gfx.setTexture(key2);
        });
        
        buttonZone.on('pointerup', () => {
            if(typeof(key1) !== 'undefined') this.gfx.setTexture(key1);
            
            if(onClick) onClick(this);
        });
        
        if(typeof(parent) !== 'undefined') {
            parent.add(this);
        } else {
            this.scene.add.existing(this);
        }
    }
}