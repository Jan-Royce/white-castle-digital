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
        
        this.scene.events.on('remote_undo_place_die', (data) => {
            // TODO use data.player to determine which player would get the coin and/or lantern changes
            
            if(data.has_coin_diff) {
                const coinDiff = data.coin_diff * -1;
                const coinUpdate = {
                    type: 'resource',
                    resources: {
                        coin: coinDiff
                    }
                };
                //TODO emit event to player function for gaining resource
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
        });
    }
}