import { ActionBar } from "../components/ActionBar.js";

export class ActionManager {
    constructor(scene) {
        this.scene = scene;
        this.action_stack = [];
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.scene.events.on('gain_resources', (data) => {
            // emit event for player function for gaining resources here
            // also socket emit for opponent data updates
            this.action_stack.push(data);
        });
        
        this.scene.events.on('trigger_lantern', () => {
            console.log('lantern!');
            // emit event for player function for lantern trigger here (should have influence track daimyo pay logic)
            // also socket emit for opponent data updates
            
            // push lantern resources, etc to the action stack
        });
        
        this.scene.events.on('add_actions', (actions) => {
            const barW = this.scene.scale.width * 0.6;
            const barH  = 100;
            
            const actionBar = new ActionBar({
                scene: this.scene,
                x: (this.scene.scale.width - barW) / 2,
                y: this.scene.scale.height - barH - 20,
                w: barW,
                h: barH,
                actions: actions
            });
            this.scene.add.existing(actionBar);
        });
    }
}