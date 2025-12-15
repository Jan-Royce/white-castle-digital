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
        
        this.button_w = 200;
        this.button_h = 50;
        
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
        
        this.bindEvents();
    }
    
    setActions(actions) {
        let xPos = 0;
        
        for(const actionSet of actions) {
            for(const action of actionSet) {
                const btn = this.addAction(action, xPos);
                this.actions.push(btn);
                
                xPos += 250;
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
    
    bindEvents() {
        this.scene.events.on('submit_popup_selection', (data, btn) => {
            this.gainResource(data, btn);
        });
    }
    
    clickAction(action, btn) {
        switch(action.type) {
            case 'resource':
                this.gainResource(action, btn);
                break;
            case 'select_resource':
                this.createSelectPopup(action, btn);
                break;
            case 'action':
                this.performAction(action, btn);
                break;
            case 'select_action':
                //wild die
                //domain select
                //castle/garden/yard or castle/garden or castle/yard
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
    
    gainResource(action, btn) {
        action.button_index = this.actions.indexOf(btn);
        this.scene.events.emit('gain_resources', action);
        this.removeActionAndRefresh(btn);
    }
    
    createSelectPopup(action, btn) {
        const popup = new SelectPopup({
            scene: this.scene,
            x: 0,
            y: 0,
            w: 400,
            h: 200,
            action: action,
            btn: btn
        });
        
        this.scene.add.existing(popup);
        
        popup.fade_in.play();
    }
    
    createWellSelectPopup(selectAction, resources, btn) {
        const popup = new SelectPopup({
            scene: this.scene,
            x: 0,
            y: 0,
            w: 400,
            h: 200,
            action: selectAction,
            resources: resources,
            sourceType: 'well',
            btn: btn
        });

        this.scene.add.existing(popup);

        popup.fade_in.play();
    }
    
    performAction(action, btn) {
        // TODO CONTINUE HERE
        switch(action.name) {
            case 'lantern':
                this.gainResource({ source: 'lantern', resources: this.scene.player.getLanternResources() }, btn);
                
                break;
            case 'well':
                const wellActions = this.scene.board.castle.well_actions.flat();
                const selectResourceAction = wellActions.filter((action) => action.type == 'select_resource');
                const resourceAction = wellActions.filter((action) => action.type == 'resource');
                
                if(selectResourceAction.length > 0) {
                    this.createWellSelectPopup(selectResourceAction[0], resourceAction[0].resources, btn);
                } else {
                    resourceAction[0].source = 'well';
                    this.gainResource(resourceAction[0], btn);
                }
                break;
            case 'white_scroll':
                break;
            case 'black_scroll':
                break;
            case 'red_die_tile':
                break;
            case 'black_die_tile':
                break;
            case 'white_die_tile':
                break;
            case 'garden':
                break;
            case 'castle':
                break;
            case 'yard':
                break;
            default:
                break;
        }
    }
    
    addAction(action, xPos=0) {
        let content = "";
        if (action.type == 'action' || action.type == 'select_action' || action.type == 'select_resource') {
            content = action.name;
        } else if (action.type == 'paid_action') {
            content = `${JSON.stringify(action.cost)} -> ${action.name}`;
        } else {
            content = JSON.stringify(action.resources);
        }
        
        const btn = new Button({
            scene: this.scene,
            x: xPos,
            y: (this.h - this.button_h) / 2,
            w: this.button_w,
            h: this.button_h,
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
        btn.button_text.x = (this.button_w - btn.button_text.displayWidth) / 2;
        btn.button_text.y = (this.button_h - btn.button_text.displayHeight) / 2;
        
        return btn;
    }
    
    addBackAction(action) {
        let index = action.button_index;
        const btn = this.addAction(action);
        this.actions.splice(index, 0, btn);
    }
    
    removeAction(btn) {
        let index = this.actions.indexOf(btn);
        this.actions.splice(index, 1);
        btn.destroy(true);
        
        if(this.actions.length == 0) this.scene.events.emit('hide_action_bar');
    }
    
    removeActionAndRefresh(btn) {
        this.removeAction(btn);
        if (this.actions.length > 0) this.updateActions();
    }
    
    clearActions() {
        for(const action of this.actions) {
            action.destroy(true);
        }
        this.actions = [];
    }
}