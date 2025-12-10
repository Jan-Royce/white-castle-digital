export class ClickableNumberInput extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, name, max, fontSize, color, strokeColor } = config;
        
        super(scene, x, y);
        
        this.name = name;
        this.color = color ?? '#fff';
        this.stroke_color = strokeColor ?? '#000';
        this.value = 0;
        this.max = max;
        
        const counter = new Phaser.GameObjects.Text(scene, 0, 0, "0", {
            fontSize: `${fontSize}px`,
            fontStyle: 'bold',
            color: '#fff'
        });
        counter.setStroke('#000', 2);
        counter.setOrigin(0);
        
        counter.setInteractive({ useHandCursor: true });
        
        counter.on('pointerup', (pointer) => {
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
        
        this.add(counter);
        this.counter = counter;
    }
    
    setNewMaximum(newMax) {
        this.max = newMax;
        
        if(newMax > 0) {
            this.counter.setAlpha(1);
            this.counter.setInteractive({ useHandCursor: true });
        } else if(this.value == 0) {
            this.counter.setAlpha(0.5);
            this.counter.disableInteractive();
        }
    }
}