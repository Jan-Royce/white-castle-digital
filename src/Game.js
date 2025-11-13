class Game {
    constructor() {
       this.players = {};
       this.colors = this.getGameColors();
       this.turn_order = [];
       this.active_player_index = 0;
       this.round = 1;
       this.turn = 1;
       this.matcha_expansion = false;
       this.max_turn_per_player = this.matcha_expansion ? 4 : 3;
       this.max_total_turns = Object.entries(this.players).length * this.max_turn_per_player;
       this.garden_phase = false;
    }
    
    getGameColors() {
        let colors = ['#e65656', '#67e656', '#5690e6', '#e6d756'];
        return [...colors].sort(() => Math.random() - 0.5);
    }
    
    addPlayer(socketId, playerData) {
        playerData.color = this.assignColor();
        this.players[socketId] = playerData;
    }
    
    assignColor()
    {
        return this.colors.pop() ?? '#888888';
    }
    
    freeColor(player)
    {
        this.colors.push(player.color);
    }
    
    removePlayer(socketId) {
        this.freeColor(this.players[socketId]);
        delete(this.players[socketId]);
    }
    
    passTurn() {
        //TODO check dice count
        
        if(this.turn < this.max_total_turns) {
            this.active_player_index++;
            this.turn++;
        } else {
            this.updateTurnOrder();
            
            if(this.round < 3) {
                this.garden_phase = true; //or maybe create garden phase func/scene
                //this.round++; // after garden
            } else {
                this.calculateScores();
            }
        }
    }
    
    passGardenTurn() {
        //TODO?
    }
    
    updateTurnOrder() {
        //TODO
        this.active_player_index = 0;
        this.turn = 1;
    }
    
    calculateScores() {
        //TODO
    }
}

module.exports = Game;