export class Button extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, fontSize, fontColor, bgColor, key1, key2, imgScale, showBgColor, text, onClick, parent, enabled, optional } = config;
        
        super(scene, x, y);
        
        this.font_color = fontColor ?? "#000";
        this.font_size = fontSize ?? 28;
        this.bg_color = bgColor ?? "#c7c7c7";
        this.int_bg_color = parseInt(this.bg_color.replace(/^#/, ''), 16);
        this.gfx = null;
        this.show_bg_color = typeof(showBgColor) === 'undefined' || showBgColor == true;
        this.w = w ?? 100;
        this.h = h ?? 50;
        this.img_scale = imgScale ?? 1;
        this.enabled = typeof(enabled) === 'undefined' || enabled;
        this.optional = typeof(optional) === 'undefined' || optional;
        
        const clickZone = new Phaser.GameObjects.Zone(scene, 0, 0, this.w, this.h);
        clickZone.setOrigin(0);
        
        if(this.show_bg_color) {
            const buttonBg = new Phaser.GameObjects.Rectangle(scene, 0, 0, clickZone.width, clickZone.height, this.int_bg_color);
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
                this.button_bg.width = clickZone.width;
                this.button_bg.height = clickZone.height;
            }
        }
        
        const buttonText = this.scene.add.text(0, 0, text ?? '', {
            fontSize: `${this.font_size}px`, color: this.font_color
        });
        buttonText.x = (clickZone.displayWidth - buttonText.displayWidth) / 2;
        buttonText.y = (clickZone.displayHeight - buttonText.displayHeight) / 2;
        
        this.add(clickZone);
        clickZone.setInteractive({ useHandCursor: true });
        
        this.add(buttonText);
        
        this.click_zone = clickZone;
        this.button_text = buttonText;
        
        clickZone.on('pointerdown', () => {            
            if (typeof(key2) !== 'undefined') this.gfx.setTexture(key2);
        });
        
        clickZone.on('pointerup', () => {
            if(typeof(key1) !== 'undefined') this.gfx.setTexture(key1);
            
            if(onClick) onClick(this);
        });
        
        if(typeof(parent) !== 'undefined') {
            parent.add(this);
        } else {
            this.scene.add.existing(this);
        }
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, this.w, this.h);
        zone.setOrigin(0);
        this.add(zone);
        this.zone = zone;
        
        if(!this.enabled) {
            this.setDisabled();
        }
    }
    
    setEnabled() {
        this.zone.disableInteractive();
        
        this.button_text.setColor(this.font_color);
        if(this.button_bg) {
            this.button_bg.setFillStyle(this.int_bg_color);
        }
        this.setAlpha(1);
    }
    
    setDisabled() {
        this.zone.setInteractive();
        
        this.button_text.setColor('#fff');
        if(this.button_bg) {
            this.button_bg.setFillStyle(0x000);
        }
        this.setAlpha(0.5);
    }
}