// TODO: ADD Max Limit PLAYER Daimyo, food, iron and pearl
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
        
        this.domain_card_section = {};
        this.lantern = {
            type: 'resource',
            resources: []
        }
    }

    countResourceClanPoints(){
        const RESOUREVALUES = [this.food, this.iron, this.pearl];

        this.clan_points += Math.floor((this.coin + this.daimyo) / 5);

        RESOUREVALUES.forEach(value =>{
            if(value >= 3) this.clan_points++;
            if(value == 7) this.clan_points++;
        });
    }

    addLanternReward(resourceReward){
        this.lantern.resources.push({[resourceReward]: 1});
    }

    setDomainCard(sizes,sections){
        const colors = ['red', 'black', 'white'];
        let colorIndex = 0;
        let sectionIndex = 0;

        sizes.forEach(size =>{
            for(let i = 0; i < size;i++){
                this.domain_card_section[colors[colorIndex]] = sections[sectionIndex];
                colorIndex++;
            }
            sectionIndex++;
        })
        if(sizes.length != 2){
            this.addLanternReward('coin');
        }else this.addLanternReward('clan_points');
    }

    // Check if matcha Expansion enable
    domainBoardRewardRow(matcha_expansion,dieColor){
        if(matcha_expansion){matchaBoardReward(dieColor);}
        else{this.baseBoardReward(dieColor);}
    }

    baseBoardReward(dieColor){
        const REWARD = {
            red:{
                0:{food:1},
                1:{food:2},
                2:{food:3},
                3:{food:3, coin:2},
                4:{food:4, coin:2},
                5:{food:4, coin:2, daimyo:1},
            },
            black:{
                0:{iron:1},
                1:{iron:2},
                2:{iron:3},
                3:{iron:3, lantern: true},
                4:{iron:4, lantern: true},
                5:{iron:4, lantern: true, coin:2},
            },
            white:{
                0:{pearl:1},
                1:{pearl:2},
                2:{pearl:3},
                3:{pearl:3, daimyo:1},
                4:{pearl:4, daimyo:1},
                5:{pearl:4, daimyo:1, lantern: true},
            }
        };
        switch(dieColor){
            case 'red':
                this.sectionRewardTrigger(REWARD.red[this.domain_courtier]);
                break;
                case 'black':
                this.sectionRewardTrigger(REWARD.black[this.domain_courtier]);
                break;
            case 'white':
                this.sectionRewardTrigger(REWARD.white[this.domain_warrior]);
                break;
        }
        this.domainCardSectionTrigger(dieColor)
    }

    sectionRewardTrigger(rewards){
        for(const type in rewards){
            if(type === "lantern" && rewards[type] === true){
                this.lanternTrigger();
            }else{
                this[type] += rewards[type];
            }
        }
    }
    
    domainCardSectionTrigger(dieColor){
        this.domain_card_section[dieColor].forEach(node =>{
            if(node.type === 'resource'){
                for(const type in node.resources){
                    this[type] += node.resources[type];
                }
            }else{
                // Type : Action
            }
        });
    }

    lanternTrigger()
    {
        this.lantern.resources.forEach(resource => {
            for(const type in resource){
                if(this[type] !== undefined){
                    this[type] += resource[type];
                }
            }
        });
    }
}

module.exports = Player;