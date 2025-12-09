export class ClickableNumberInput extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, name, max, fontSize, color, strokeColor } = config;
        
        super(scene, x, y);
        
        this.name = name;
        this.color = color ?? '#fff';
        this.stroke_color = strokeColor ?? '#000';
        this.value = 0;
        this.max = max;
        
        const counter = new Phaser.GameObjects.Text(this.scene, 0, 0, "0", {
            fontSize: `${fontSize}px`,
            fontStyle: 'bold',
            color: '#fff'
        });
        counter.setStroke('#000', 2);
        counter.setOrigin(0);
        this.add(counter);
        this.counter = counter;
        
        counter.setInteractive({ useHandCursor: true });
        
        counter.on('pointerup', (pointer) => {
            if(pointer.leftButtonReleased()) {
                this.value += 1;
                if(this.value > this.max) {
                    this.value = this.max;
                    return;
                }
            } else if(pointer.rightButtonReleased()) {
                this.value -= 1;
                if(this.value < 0) {
                    this.value = 0;
                    return;
                }
            }
            counter.setText(this.value);
            
            this.scene.events.emit('change_selector_input');
        });
    }
    
    setNewMaximum(newMax) {
        this.max = newMax;
        
        if(newMax > 0) {
            this.counter.setAlpha(1);
            this.counter.setInteractive();
        } else {
            if(this.value == 0) {
                this.counter.setAlpha(0.5);
                this.counter.disableInteractive();
            }
        }
    }
}