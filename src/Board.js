class Board {
    constructor(config) {
        const { playerCount, matchaExpansion } = config;
        
        this.player_count = playerCount;
        this.matcha_expansion = matchaExpansion;
        this.bridges = {};
        this.castle = [];
        this.yard = [];
        this.garden = {};
        this.well = {};
        
        this.setBridges();
        this.setCastle();
    }
    
    setBridges() {
        let diceCount = this.player_count + 1;
        let bridges = {};
        let colors = ['red', 'black', 'white'];
        
        if(this.matcha_expansion) colors.push('green');
        
        for(let color of colors) {
            let dice = [];
            
            for(let i=0; i<diceCount; i++) {
                dice.push(Math.floor(Math.random() * 6 + 1));
            }
            dice.sort();
            bridges[color] = dice;
        }
        
        this.bridges = bridges;
    }
    
    setCastle() {
        
    }
}

module.exports = Board;