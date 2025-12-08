export class EventManager {
    constructor(scene) {
        this.scene = scene;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.scene.events.on('remote_place_die', (data) => {
            const die = data.die;
            const bridge = this.scene.board.bridges[die.color];
            const toRemove = bridge.dice[data.die_index];
            const dieSpace = this.scene.board.die_spaces[data.space_index];
            
            bridge.removeDie(data.die_index, toRemove);
            dieSpace.placeDie(die);
        });
    }
}