class Player {
    constructor(id) {
        this.id = id;
        this.color = '';
        
        //resources
        this.coin = 0;
        this.daimyo = 0;
        this.food = 0;
        this.iron = 0;
        this.pearl = 0;
        // this.chasen = 0;
        
        //states/position
        this.clan_points = 0;
        this.active_player = false;
        this.influence = [0, 0];
        this.domain_courtier = -1;
        this.domain_gardener = -1;
        this.domain_warrior = -1;
        // this.domain_geysha = -1;
        
        this.lantern = {
            type: 'resource',
            resources: {}
        }
    }
}

module.exports = Player;