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
        this.domain_courtier = 0;
        this.domain_gardener = 0;
        this.domain_warrior = 0;
        // this.domain_geysha = -1;
        
        this.castle_card = null;

        this.lantern = {
            type: 'resource',
            resources: {}
        }
    }

    countResourceClanPoints(){
        const RESOUREVALUES = [this.food, this.iron, this.pearl];

        if(this.coins > 0) {
            this.clan_points += Math.floor((this.coin + this.daimyo) / 5);
        }

        RESOUREVALUES.forEach(value =>{
            if(value >= 3) this.clan_points++;
            if(value == 7) this.clan_points++;
        });
    }

    // Setting the castle Card
    setCastleCard(castleCard){
        this.castle_card = castleCard;
    }
    
    // Check if matcha Expansion enable
    domainBoardRewardRow(matcha_expansion,dieColor){
        if(matcha_expansion){matchaBoardReward(dieColor);}
        else{this.baseBoardReward(dieColor);}
    }

    lanternReward()
    {
        //TODO: Reward card trigger
    }

    baseBoardReward(dieColor){
        console.log(dieColor);
        const REWARD = {
            red:{
                0:{food:1, coin:0, daimyo:0},
                1:{food:2, coin:0, daimyo:0},
                2:{food:3, coin:0, daimyo:0},
                3:{food:3, coin:2, daimyo:0},
                4:{food:4, coin:2, daimyo:0},
                5:{food:4, coin:2, daimyo:1},
            },
            black:{
                0:{iron:1, lantern: false, coin:0},
                1:{iron:2, lantern: false, coin:0},
                2:{iron:3, lantern: false, coin:0},
                3:{iron:3, lantern: true, coin:0},
                4:{iron:4, lantern: true, coin:0},
                5:{iron:4, lantern: true, coin:2},
            },
            white:{
                0:{pearl:1, daimyo:0, lanter: false},
                1:{pearl:2, daimyo:0, lanter: false},
                2:{pearl:3, daimyo:0, lanter: false},
                3:{pearl:3, daimyo:1, lanter: false},
                4:{pearl:4, daimyo:1, lanter: false},
                5:{pearl:4, daimyo:1, lantern: true},
            }
        };
        switch(dieColor){
            case 'red':
                this.food += REWARD.red[this.domain_courtier].food;
                this.coin += REWARD.red[this.domain_courtier].coin;
                this.daimyo += REWARD.red[this.domain_courtier].daimyo;
                //TODO: Castle Card row Trigger
                break;
            case 'black':
                this.iron += REWARD.black[this.domain_gardener].iron;
                this.coin += REWARD.black[this.domain_gardener].coin;
                if(REWARD.black[this.domain_gardener].lantern) {lanternReward()};
                //TODO: Castle Card row Trigger
                break;
            case 'white':
                this.iron += baseRewar.white[this.domain_gardener].pearl;
                this.coin += REWARD.white[this.domain_gardener].coin;
                //TODO: Castle Card row Trigger
                if(REWARD.white[this.domain_gardener].lantern) {lanternReward()};
                break;
        }
    }
    matchaBoardReward(dieColor){
        //TODO: Matcha Reward
    }
}

module.exports = Player;