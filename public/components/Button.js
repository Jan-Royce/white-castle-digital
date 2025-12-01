export class Button extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, fontSize, fontColor, bgColor, key1, key2, text, onClick, parent } = config;
        
        super(scene, x, y);
        
        let button = null;
        if(typeof(key1) !== 'undefined') {
            button = this.scene.add.image(x, y, key1).setInteractive({ useHandCursor: true });
        } else {
            let color = parseInt(bgColor.replace(/^#/, ''), 16);
            button = this.scene.add.rectangle(0, 0, w, h, color).setInteractive({ useHandCursor: true });
        }
        const buttonText = this.scene.add.text(x, y, text ?? '', {
            fontSize: `${fontSize ?? 28}px`, color: fontColor
        });
        Phaser.Display.Align.In.Center(buttonText, button);
        
        this.add(button);
        this.add(buttonText);
        
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