export class EventManager {
    constructor(scene) {
        this.scene = scene;
        
        this.bindEvents();
    }
    
    bindEvents() {
        this.scene.events.on('remote_remove_die', (die) => {
            const bridge = this.scene.board.bridges[die.color];
            const toRemove = bridge.dice[die.index];
            bridge.removeDie(die.index, toRemove);
        });

        this.scene.events.on('remote_place_die', (data) => {
            const die = data.die;
            const dieSpace = this.scene.board.die_spaces[data.index];
            dieSpace.placeDie(die);
        });
    }
}