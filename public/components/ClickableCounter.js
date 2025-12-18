export class ClickableCounter extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, name, max, fontSize, color, strokeColor, sprite } = config;
        
        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.name = name;
        this.color = color ?? '#fff';
        this.stroke_color = strokeColor ?? '#000';
        this.value = 0;
        this.max = max;
        this.icon = null;
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, w, h, 0xbbffbb);
        bg.setOrigin(0);
        this.add(bg);
        this.bg = bg;
        
        const spr = new Phaser.GameObjects.Sprite(scene, 0, 0, sprite);
        spr.setOrigin(0);
        spr.setScale(0.24);
        spr.y = (h - spr.displayHeight) / 2;
        this.add(spr);
        
        const counter = new Phaser.GameObjects.Text(scene, 0, 0, "0", {
            fontSize: `${fontSize}px`,
            fontStyle: 'bold',
            color: '#fff'
        });
        counter.x = w * 0.6;
        counter.y = (h - counter.displayHeight) / 2;
        counter.setStroke('#000', 2);
        counter.setOrigin(0);
        this.add(counter);
        this.counter = counter;
        
        bg.setInteractive({ useHandCursor: true });
        
        bg.on('pointerup', (pointer) => {
            const oldValue = this.value;
            if(pointer.leftButtonReleased()) {
                this.value += 1;
                this.value = Math.min(this.value, this.max);
            } else if(pointer.rightButtonReleased()) {
                this.value -= 1;
                this.value = Math.max(this.value, 0);
            }
            counter.setText(this.value);
            
            if(oldValue == this.value) return;
            
            this.scene.events.emit('change_selector_input');
        });
        
        const bgOverlay = new Phaser.GameObjects.Rectangle(scene, 0, 0, w, h, 0x000);
        bgOverlay.setAlpha(0);
        bgOverlay.setOrigin(0);
        this.add(bgOverlay);
        this.bg_overlay = bgOverlay;
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, w, h);
        zone.setOrigin(0);
        this.add(zone);
        this.zone = zone;
    }
    
    setNewMaximum(newMax) {
        this.max = newMax;
        
        if(newMax > 0) {
            this.zone.disableInteractive();
            this.bg_overlay.setAlpha(0);
        } else if(this.value == 0) {
            this.zone.setInteractive();
            this.bg_overlay.setAlpha(0.5);
        }
    }
}