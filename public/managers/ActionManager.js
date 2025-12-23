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
                this.scene.player.updateResources({
                    resources: { coin: data.coin_diff },
                    source: null, // die placement?
                    revert: false
                });
            }
            
            if(data.has_lantern_trigger) {
                this.scene.player.updateResources({
                    resources: this.scene.player.getLanternResources(),
                    source: 'lantern',
                    revert: false
                });
            }
            
            this.scene.board.disableBridges();
            this.addActionToStack(data);
        });
        
        this.scene.events.on('gain_resources', (data) => {
            const resourceActions = ['well', 'lantern'];
            if(typeof(data.source) !== 'undefined' && resourceActions.includes(data.source)) {
                this.addActionToStack({
                    type: 'action',
                    name: data.source,
                    button_index: data.button_index,
                    resources: data.resources
                });
            } else {
                this.addActionToStack(data);
            }
            
            this.scene.player.updateResources({
                resources: data.resources,
                source: data.source,
                revert: false
            });
        });
        
        this.scene.events.on('enter_main_action_mode', (data) => {
            //TODO CONTINUE HERE
            this.addActionToStack(data);
            switch(data.action) {
                case 'castle':
                    this.performCastleAction();
                    break;
                case 'garden':
                    console.log('garden');
                    break;
                case 'yard':
                    console.log('yard');
                    break;
            }
        });
        
        this.scene.events.on('send_courtier', (data) => {
            this.addActionToStack(data);
            
            if(data.sent_courtier) {
                this.scene.events.emit('player_send_courtier', data);
                
                this.scene.player.updateResources({
                    resources: { coin: -2 },
                    source: 'send_courtier',
                    revert: false
                });
                
                this.scene.board.castle.sendCourtier(this.scene.player.id);
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
        const gapFromPlayerUI = 60;

        const actionBar = new ActionBar({
            scene: this.scene,
            x: (this.scene.scale.width - barW) / 2 + gapFromPlayerUI,
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
            
            // TODO fix die highlight/interaction bug after undo
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
            onClick: () => {
                this.undoAction();
            }
        });
        
        btn.zone.setOrigin(0);
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
    
    performCastleAction() {
        console.log(`coin: ${this.scene.player.coin}`)
        console.log(`daimyo: ${this.scene.player.daimyo}`)
        
        const sendCourtierBtn = this.action_bar.pushAction({
            type: 'send_courtier',
            button_content: '{"coin": 2} -> courtier to gate',
            enabled: this.scene.player.coin >= 2,
            resource_listener: {
                resource: 'coin',
                amount: 2
            },
            optional: true
        });
        
        // TODO CONTINUE HERE - move courtier buttons logic
        
        const moveCourtierBtn1 = this.action_bar.pushAction({
            type: 'move_courtier',
            button_content: '{"pearl": 2} -> move 1',
            enabled: false,
            // TODO only enable if a courtier is available to move
            // TODO should be unavailable if the other is executed
            resource_listener: {
                resource: 'pearl',
                amount: 2
            }
        });
        
        const moveCourtierBtn2 = this.action_bar.pushAction({
            type: 'move_courtier',
            button_content: '{"pearl": 5} -> move 2',
            enabled: false,
            // TODO only enable if a courtier is available to move
            // TODO should be unavailable if the other is executed
            resource_listener: {
                resource: 'pearl',
                amount: 5
            }
        });
        
        this.action_bar.updateActions();
        
        // TODO for undo
        this.action_stack.push({
            type: 'add_courtier_buttons',
            buttons: [sendCourtierBtn, moveCourtierBtn1, moveCourtierBtn2]
        });
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
            case 'select_action':
                this.undoSelectAction(toUndo);
                break;
            case 'add_buttons':
                // TODO CONTINUE HERE
                console.log('undo buttons')
                break;
            case 'send_courtier':
                this.undoSendCourtier(toUndo);
                break;
            // paid_action
            // select_action
            default:
                // TODO ??
                break;
        }
        
        if(this.action_stack.length > 0 && !this.action_bar.visible) {
            this.scene.events.emit('show_action_bar');
        } else if(this.action_stack.length == 0) {
            this.action_undo_btn.setVisible(false);
        }
    }
    
    undoDiePlacement(data) {
        if(data.has_coin_diff) {
            this.scene.player.updateResources({
                resources: { coin: data.coin_diff },
                source: null, // die placement?
                revert: true
            });
        }
        
        if(data.has_lantern_trigger) {
            this.scene.player.updateResources({
                resources: this.scene.player.getLanternResources(),
                source: 'lantern',
                revert: true
            });
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
        this.scene.player.updateResources({
            resources: data.resources,
            source: data.source,
            revert: true
        });
        
        this.action_bar.addBackAction(data);
        this.action_bar.updateActions();
    }
    
    undoPerformAction(data) {
        // TODO continue here
        // switch case to actualy revert different action types
        switch(data.name) {
            case 'lantern':
                this.scene.player.updateResources({
                    resources: this.scene.player.getLanternResources(),
                    source: 'lantern',
                    revert: true
                });
                break;
            case 'well':
                this.scene.player.updateResources({
                    resources: data.resources,
                    source: data.source,
                    revert: true
                });
                break;
            default:
                break;
        }
        
        this.action_bar.addBackAction(data);
        this.action_bar.updateActions();
    }
    
    undoSelectAction(data) {
        this.action_bar.addBackAction(data);
        this.action_bar.updateActions();
    }
    
    undoSendCourtier(data) {
        if(data.sent_courtier) {
            this.scene.events.emit('player_unsend_courtier', data);
            
            this.scene.player.updateResources({
                resources: { coin: -2 },
                source: 'send_courtier',
                revert: true
            });
            
            this.scene.board.castle.unsendCourtier(this.scene.player.id);
        }
        
        data.button_content = '{"coin": 2} -> courtier to gate';
        data.enabled = this.scene.player.coin >= 2;
        data.resource_listener = {
            resource: 'coin',
            amount: 2
        };
        data.optional = true;
        
        this.action_bar.addBackAction(data);
        this.action_bar.updateActions();
    }
}