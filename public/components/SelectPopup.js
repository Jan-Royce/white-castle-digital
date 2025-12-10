import { Button } from "./Button.js";
import { ClickableNumberInput } from "./ClickableNumberInput.js";

export class SelectPopup extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, action, btn } = config;
        
        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.color = 0x464646;
        this.action = action;
        this.action_btn = btn;
        this.selectors = [];
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, scene.scale.width, scene.scale.height);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, scene.scale.width, scene.scale.height, 0x000000);
        bg.setOrigin(0);
        bg.setAlpha(0.75);
        this.add(bg);
        
        const popup = new Phaser.GameObjects.Container(scene, 0, 0);
        popup.x = (scene.scale.width - this.w) / 2;
        popup.y = (scene.scale.height - this.h) / 2;
        this.add(popup);
        this.popup = popup;
        
        const popupBg = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.w, this.h, this.color);
        popupBg.setOrigin(0);
        popupBg.setAlpha(0.95);
        popup.add(popupBg);
        
        this.setAlpha(0);
        this.setDepth(20);
        
        this.addButtons();
        this.createSelection();
        
        this.fade_in = this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power3',
            persist: true
        });
    }
    
    addButtons() {
        const buttonWrap = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.popup.add(buttonWrap);
        
        const buttonW = 80;
        const buttonH = 32;
        const buttonGap = 20;
        
        const submitBtn = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            w: buttonW,
            h: buttonH,
            fontColor: '#000',
            fontSize: 16,
            text: 'Submit',
            parent: buttonWrap,
            centerAlign: false,
            onClick: () => {
                switch(this.action.type) {
                    case 'select_resource':
                        if (this.value < this.max) {
                            this.error_text.setText("Not enough resource(s) selected.");
                            this.error_text.x = (this.w - this.error_text.displayWidth) / 2;
                            this.error_text.setVisible(true);
                            return;
                        }
                        this.getResourceSelections();
                        break;
                    case 'select_action':
                        // TODO
                        break;
                    default:
                        // TODO ??
                        break;
                }
                
                this.closePopup();
            }
        });
        
        submitBtn.button.setOrigin(0);
        submitBtn.button_text.x = (buttonW - submitBtn.button_text.displayWidth) / 2;
        submitBtn.button_text.y = (buttonH - submitBtn.button_text.displayHeight) / 2;
        
        const closeBtn = new Button({
            scene: this.scene,
            x: buttonW + buttonGap,
            y: 0,
            w: buttonW,
            h: buttonH,
            fontColor: '#000',
            fontSize: 16,
            text: 'Close',
            parent: buttonWrap,
            centerAlign: false,
            onClick: () => {
                this.closePopup();
            }
        });
        
        closeBtn.button.setOrigin(0);
        closeBtn.button_text.x = (buttonW - closeBtn.button_text.displayWidth) / 2;
        closeBtn.button_text.y = (buttonH - closeBtn.button_text.displayHeight) / 2;
        
        buttonWrap.x = this.w - (buttonW * 2) - buttonGap - 8;
        buttonWrap.y = this.h - buttonH - 8;
    }
    
    closePopup() {
        this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Power3',
            onComplete: () => {
                this.setVisible(false);
                this.destroy(true);
            }
        });
    }
    
    // TODO continue here
    createSelection() {
        // console.log(this.action)
        switch(this.action.type) {
            case 'select_resource':
                this.max = this.action.amount;
                this.value = 0;
                this.createResourceSelector();
                break;
            case 'select_action':
                // TODO
                break;
            default:
                // TODO ??
                break;
        }
    }
    
    createResourceSelector() {
        let textContent = `Select ${this.max} resources in any combination\n(left click: +, right click: -)`;
        
        const text = new Phaser.GameObjects.Text(this.scene, 4, 8, textContent, {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#fff'
        });
        text.x = (this.w - text.displayWidth) / 2;
        text.setStroke('#000', 2);
        text.setOrigin(0);
        this.popup.add(text);
        
        const ui = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'ui_resource_selector');
        ui.setOrigin(0);
        ui.setScale(0.35);
        ui.x = (this.w - ui.displayWidth) / 2;
        ui.y = (this.h - ui.displayHeight) / 2;
        this.popup.add(ui);
        
        const resources = ['food', 'iron', 'pearl'];
        const xPosList = [98, 224, 352];
        
        let i = 0;
        for(const resource of resources) {
            const selector = new ClickableNumberInput({
                scene: this.scene,
                x: xPosList[i],
                y: 0,
                max: this.max,
                fontSize: 36,
                name: resource
            });
            selector.y = (this.h - selector.counter.displayHeight) / 2;
            this.popup.add(selector);
            
            this.selectors.push(selector);
            
            i++;
        }
        
        const errorTextY = ui.y + ui.displayHeight - 16;
        const errorText = new Phaser.GameObjects.Text(this.scene, 4, errorTextY, "", {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#e43838'
        });
        errorText.setStroke('#000', 2);
        errorText.setOrigin(0);
        errorText.setVisible(false);
        this.popup.add(errorText);
        this.error_text = errorText;
        
        this.scene.events.on('change_selector_input', () => {
            this.getCurrentSelectorValue();
            
            for(let i=0; i<this.selectors.length; i++) {
                const selector = this.selectors[i];
                let newMax = Math.max(this.max - this.value, 0);
                
                newMax += selector.value;
                selector.setNewMaximum(newMax);
            }
        });
    }
    
    getResourceSelections() {
        let resources = {};
        for(const selector of this.selectors) {
            resources[selector.name] = selector.value;
        }
        
        const data = {
            type: 'select_resource',
            name: `select_resource_${this.max}`,
            resources: resources,
            amount: this.max
        };
        
        this.scene.events.emit('submit_popup_selection', data, this.action_btn);
    }
    
    getCurrentSelectorValue() {
        let value = 0;
        for(const selector of this.selectors) {
            value += selector.value;
        }
        
        this.value = value;
    }
}