import { Button } from "./Button.js";
import { SelectPopup } from "./SelectPopup.js";

export class ActionBar extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h } = config;
        
        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.color = 0x464646;
        this.actions = [];
        
        // for blocking other interactive objects behind UI
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, this.w, this.h);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.w, this.h, this.color);
        background.setOrigin(0);
        this.add(background);
        this.setAlpha(0);
        
        this.setDepth(10);
    }
    
    setActions(actions) {
        const buttonW = 200;
        const buttonH = 50;
        
        let xPos = 0;
        
        for(const actionSet of actions) {
            for(const action of actionSet) {
                let content = "";
                if (action.type == 'action' || action.type == 'select_action' || action.type == 'select_resource') {
                    content = action.name
                } else if(action.type == 'paid_action') {
                    content = `${JSON.stringify(action.cost)} -> ${action.name}`;
                } else {
                    content = JSON.stringify(action.resources)
                }
                
                const btn = new Button({
                    scene: this.scene,
                    x: xPos,
                    y: (this.h - buttonH) / 2,
                    w: buttonW,
                    h: buttonH,
                    fontColor: '#000',
                    fontSize: 14,
                    text: content,
                    parent: this,
                    centerAlign: false,
                    onClick: (btn) => {
                        this.clickAction(action, btn);
                    }
                });
                
                btn.button.setOrigin(0);
                btn.button_text.x = (buttonW - btn.button_text.displayWidth) / 2;
                btn.button_text.y = (buttonH - btn.button_text.displayHeight) / 2;
                
                xPos += 250;
                
                this.actions.push(btn);
            }
        }
    }
    
    updateActions() {
        let xPos = 0;
        
        for(const action of this.actions) {
            action.x = xPos;
            
            xPos += 250;
        }
    }
    
    clickAction(action, btn) {
        action.source = 'action_bar';
        switch(action.type) {
            case 'resource':
                this.scene.events.emit('gain_resources', action);
                this.removeAction(btn);
                this.updateActions();
                break;
            case 'select_resource':
                this.createSelectPopup(action);
                break;
            case 'action':
                // TODO
                break;
            case 'select_action':
                // TODO
                break;
            case 'paid_action':
                // TODO
                break;
            default:
                // TODO ??
                break;
        }
    }
    
    createSelectPopup(action) {
        console.log(action)
        const popup = new SelectPopup({
            scene: this.scene,
            x: 0,
            y: 0,
            w: 400,
            h: 200,
            action: action
        });
        
        this.scene.add.existing(popup);
        
        popup.fade_in.play();
    }
    
    removeAction(btn) {
        let index = this.actions.indexOf(btn);
        this.actions.splice(index, 1);
        btn.destroy();
    }
    
    clearActions() {
        for(const action of this.actions) {
            action.destroy();
        }
    }
}