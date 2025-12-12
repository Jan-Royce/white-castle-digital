class Game {
    constructor() {
       this.players = {};
       this.game_started = false;
       this.colors = this.getGameColors();
       this.turn_order = [];
       this.active_player_index = 0;
       this.round = 1;
       this.turn = 1;
       this.matcha_expansion = false;
       this.die_tile_promo = false;
       this.max_turn_per_player = this.matcha_expansion ? 4 : 3;
       this.max_total_turns = Object.entries(this.players).length * this.max_turn_per_player;
       this.garden_phase = false;
       
       this.dev_mode = process.env.MODE == 'development';
    }
    
    getGameColors() {
        let colors = ['#e65656', '#67e656', '#5690e6', '#e6d756'];
        return [...colors].sort(() => Math.random() - 0.5);
    }
    
    addPlayer(socketId, playerData) {
        this.players[socketId] = playerData;
    }
    
    getPlayerCount()
    {
        return Object.entries(this.players).length;
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
    
    getPlayerColorMap() {
        let colorMap = {};
        for(const [id, player] of Object.entries(this.players)) {
            colorMap[player.id] = parseInt(player.color.replace(/^#/, ''), 16);
        }
        
        return colorMap;
    }
    
    startBoard() {
        const Board = require('./Board');
        this.board = new Board({
            playerCount: Object.entries(this.players).length,
            matchaExpansion: this.matcha_expansion,
            dieTilePromo: this.die_tile_promo,
            colorMap: this.getPlayerColorMap(),
            devMode: this.dev_mode
        });
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