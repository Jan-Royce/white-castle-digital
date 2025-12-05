export class ActionManager {
    constructor(scene) {
        this.scene = scene;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.scene.events.on('place_die_coins', (data) => {
            console.log(data);
        });
        
        this.scene.events.on('trigger_lantern', () => {
            console.log('lantern!');
        });
        
        this.scene.events.on('add_actions', (actions) => {
            console.log(actions);
        });
    }
}