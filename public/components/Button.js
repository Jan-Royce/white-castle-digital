export class Button extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, fontColor, key1, key2, text, onClick } = config;
        
        super(scene, x, y);
        
        const button = this.scene.add.image(x, y, key1).setInteractive({ useHandCursor: true });
        const buttonText = this.scene.add.text(x, y, text ?? '', {
            fontSize: '28px', color: fontColor
        });
        Phaser.Display.Align.In.Center(buttonText, button);
        
        this.add(button);
        this.add(buttonText);
        
        button.on('pointerdown', () => {            
            button.setTexture(key2);
        });
        
        button.on('pointerup', () => {
            button.setTexture(key1);
            
            if (onClick) onClick(this);
        });
        
        this.scene.add.existing(this);
    }
}