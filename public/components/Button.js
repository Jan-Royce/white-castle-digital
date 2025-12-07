export class Button extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, fontSize, fontColor, bgColor, centerAlign, key1, key2, text, onClick, parent } = config;
        
        super(scene, x, y);
        
        this.bg_color = bgColor ?? "#c7c7c7";
        this.center_align = centerAlign ?? true;
        
        let button = null;
        if(typeof(key1) !== 'undefined') {
            button = this.scene.add.image(x, y, key1).setInteractive({ useHandCursor: true });
        } else {
            let color = parseInt(this.bg_color.replace(/^#/, ''), 16);
            button = this.scene.add.rectangle(0, 0, w, h, color).setInteractive({ useHandCursor: true });
        }
        const buttonText = this.scene.add.text(0, 0, text ?? '', {
            fontSize: `${fontSize ?? 28}px`, color: fontColor
        });
        
        if(this.center_align) Phaser.Display.Align.In.Center(buttonText, button);
        
        this.add(button);
        this.add(buttonText);
        
        this.button = button;
        this.button_text = buttonText;
        
        button.on('pointerdown', () => {            
            if (typeof(key2) !== 'undefined') button.setTexture(key2);
        });
        
        button.on('pointerup', () => {
            if(typeof(key1) !== 'undefined') button.setTexture(key1);
            
            if (onClick) onClick(this);
        });
        
        if(typeof(parent) !== 'undefined') {
            parent.add(this);
        } else {
            this.scene.add.existing(this);
        }
    }
}