import { Button } from "./Button.js";

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
        
        // TODO update for other action sources (ie well, outside wall)
        console.log(actions)
        // currently only supports castle rooms
        for(const actionSet of actions) {
            for(const action of actionSet) {
                let content = "";
                if(action.type == 'action' || action.type == 'select_resource') {
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
                    onClick: () => {
                        console.log(content)
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
    
    clearActions() {
        for(const action of this.actions) {
            action.destroy();
        }
    }
}