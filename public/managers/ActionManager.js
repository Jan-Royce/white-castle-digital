import { ActionBar } from "../components/ActionBar.js";
import { Button } from "../components/Button.js";

export class ActionManager {
    constructor(scene) {
        this.scene = scene;
        this.action_stack = [];
        
        this.createActionUndoBtn();
        
        this.bindActionEvents();
    }
    
    bindActionEvents() {
        this.scene.events.on('place_die', (data) => {
            if(data.has_coin_diff) {
                const coinUpdate = {
                    type: 'resource',
                    resources: {
                        coin: data.coin_diff
                    }
                };
                //TODO emit event to player function for gaining resource
                console.log(`coin: ${data.coin_diff}`)
            }
            
            if(data.has_lantern_trigger) {
                //TODO emit event to player function for lantern trigger here (should have influence track daimyo pay logic)
                console.log('lantern trigger')
            }
            
            this.scene.board.disableBridges();
            this.addActionToStack(data);
        });
        
        this.scene.events.on('gain_resources', (data) => {
            //TODO emit event to player function for gaining resources here
            // also socket emit for opponent data updates
            const resourceActions = ['well', 'lantern'];
            if(typeof(data.source) !== 'undefined' && resourceActions.includes(data.source)) {
                this.addActionToStack({
                    type: 'action',
                    name: data.source,
                    button_index: data.button_index
                });
            } else {
                this.addActionToStack(data);
            }
        });
        
        this.scene.events.on('add_actions', (actions) => {
            if(typeof(this.action_bar) === 'undefined') {
                this.createActionBar();
            }
            
            this.scene.events.emit('show_action_bar');
            
            this.action_bar.setActions(actions);
        });
    }
    
    createActionBar() {
        const barW = this.scene.scale.width * 0.6;
        const barH = 100;

        const actionBar = new ActionBar({
            scene: this.scene,
            x: (this.scene.scale.width - barW) / 2,
            y: this.scene.scale.height - barH - 20,
            w: barW,
            h: barH
        });
        this.scene.add.existing(actionBar);
        this.action_bar = actionBar;
        
        this.action_bar_fade_in = this.scene.tweens.add({
            targets: this.action_bar,
            alpha: { from: 0, to: 0.9 },
            duration: 1000,
            ease: 'Power1',
            persist: true
        });
        
        this.action_bar_fade_out = this.scene.tweens.add({
            targets: this.action_bar,
            alpha: { from: 0.9, to: 0 },
            duration: 500,
            ease: 'Power1',
            persist: true,
            paused: true,
            onComplete: () => {
                this.action_bar.setVisible(false);
            }
        });
        
        this.scene.events.on('show_action_bar', () => {
            this.action_bar.setAlpha(0);
            this.action_bar.setVisible(true);
            this.action_bar_fade_in.play();
        });
        
        this.scene.events.on('hide_action_bar', () => {
            this.action_bar_fade_out.play();
        });
    }
    
    createActionUndoBtn() {
        const buttonW = 100;
        const buttonH = 50;
        
        const btn = new Button({
            scene: this.scene,
            x: this.scene.scale.width - buttonW - 10,
            y: this.scene.scale.height - buttonH - 10,
            w: buttonW,
            h: buttonH,
            fontColor: '#000',
            bgColor: '#e9e9e9',
            fontSize: 14,
            text: 'UNDO',
            centerAlign: false,
            onClick: () => {
                this.undoAction();
            }
        });
        
        btn.button.setOrigin(0);
        btn.button_text.x = (buttonW - btn.button_text.displayWidth) / 2;
        btn.button_text.y = (buttonH - btn.button_text.displayHeight) / 2;
        btn.setVisible(false);
        
        this.action_undo_btn = btn;
    }
    
    addActionToStack(data) {
        this.action_stack.push(data);
        this.action_undo_btn.setVisible(true);
        
        console.log(this.action_stack)
    }
    
    undoAction() {
        const toUndo = this.action_stack.pop();
        
        switch(toUndo.type) {
            case 'die_placement':
                this.undoDiePlacement(toUndo);
                break;
            case 'resource':
            case 'select_resource':
                this.undoGainResource(toUndo);
                break;
            case 'action':
                this.undoPerformAction(toUndo);
                break;
            // paid_action
            // select_action
            default:
                // TODO ??
                break;
        }
        
        if(!this.action_bar.visible) {
            this.scene.events.emit('show_action_bar');
        }
    }
    
    undoDiePlacement(data) {
        if(data.has_coin_diff) {
            const coinDiff = data.coin_diff * -1;
            const coinUpdate = {
                type: 'resource',
                resources: {
                    coin: coinDiff
                }
            };
            //TODO emit event to player function for gaining resource
            console.log(`coin: ${coinDiff}`)
        }
        
        if(data.has_lantern_trigger) {
            //TODO emit event to player function for lantern trigger here (should have influence track daimyo pay logic)
            console.log('revert lantern trigger')
        }
        
        const die = data.die;
        const bridge = this.scene.board.bridges[die.color];
        const dieSpace = this.scene.board.die_spaces[data.space_index];
        const dir = data.has_lantern_trigger ? 'left' : 'right';
        
        dieSpace.removeDie();
        bridge.returnDie(data.die_index, die, dir);
        
        this.action_bar.clearActions();
        this.action_bar_fade_out.play();
        
        this.scene.board.enableBridges();
        
        this.scene.events.emit('undo_place_die', data);
    }
    
    undoGainResource(data) {
        //TODO emit event to player function for reverting resources here
        // also socket emit for opponent data updates
        this.action_bar.addBackAction(data);
        this.action_bar.updateActions();
    }
    
    undoPerformAction(data) {
        // TODO continue here
        // switch case to actualy revert different action types
        // switch(data.type) {}
        
        this.action_bar.addBackAction(data);
        this.action_bar.updateActions();
    }
}