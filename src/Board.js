class Board {
    constructor(config) {
        const { playerCount, matchaExpansion, dieTilePromo, colorMap } = config;
        
        this.player_count = playerCount;
        this.color_map = colorMap;
        this.matcha_expansion = matchaExpansion;
        this.die_tile_promo = dieTilePromo;
        this.bridges = {};
        this.castle = {};
        this.deck_castle_level1 = [];
        this.deck_castle_level2 = [];
        this.yard = [];
        this.garden = {};
        this.well_tiles = [];
        this.well = {};
        
        this.setBridges();
        
        let dieTiles = require('.././game_data/die_tiles.json');
        if(this.die_tile_promo) {
            dieTiles = dieTiles.filter((tile) => !tile.tag || tile.tag != 'any_resource');
        } else {
            dieTiles = dieTiles.filter((tile) => !tile.tag || tile.tag != 'promo1');
        }
        dieTiles = [...dieTiles].sort(() => Math.random() - 0.5);
        
        this.setCastle(dieTiles);
        this.setWell();
        
        this.setYard();
        this.setGarden();
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
    
    setCastle(dieTiles) {
        this.castle.levels = [];
        
        this.castle.levels.push({
            level: 0,
            clan_point: 1,
            courtiers: {}
        });
        
        /* for testing courtiers in gate
        for (const id of Object.keys(this.color_map)) {
            this.castle.levels[0].courtiers[id] = Math.floor(Math.random() * 3 + 1);
        }
            
        // would need to call gate.updateUnitDisplay() on Castle.js on the frontend
        //*/
        
        this.castle.levels.push({
            level: 1,
            clan_point: 3,
            courtiers: {},
            rooms: {
                "room1": {},
                "room2": {},
                "room3": {}
            }
        });
        
        this.castle.levels.push({
            level: 2,
            clan_point: 6,
            courtiers: {},
            rooms: {
                "room1": {},
                "room2": {}
            }
        });
        
        let dieTileColors = ['black', 'red', 'white'];
        dieTileColors = [...dieTileColors].sort(() => Math.random() - 0.5);
        
        let dieTileMap = [
            ['',''],
            ['',''],
            ['','',''],
            ['','',''],
            ['','',''],
        ];
        const tileMapOrder = [
            [0,0],
            [1,0],
            [2,1],
            [3,1],
            [4,1],
            [0,1],//
            [1,1],
            [2,2],
            [3,2],
            [4,2]
        ];
        
        let mapIndex = 2;
        for(let i=0; i<dieTileColors.length; i++) {
            const tileColor = dieTileColors[i];
            let index = dieTiles.findIndex((tile) => tile.color == tileColor);
            dieTiles.splice(index, 1);
            dieTileMap[mapIndex+i][0] = tileColor;
        }
        
        while(dieTiles.length > 2) {
            const lastColor = dieTiles.pop();
            dieTiles.splice(0, 0, lastColor);
            
            for(let i=0; i<tileMapOrder.length; i++) {
                const x = tileMapOrder[i][0];
                const y = tileMapOrder[i][1];
                
                if(dieTileMap[x][y] !== '') continue;
                
                if(i >= 5) {
                    const color = dieTiles[dieTiles.length-1].color;
                    
                    if(dieTileMap[x].filter((tile) => tile != color && tile != '').length == 0) {
                        continue;
                    }
                }
                
                const color = dieTiles.pop().color;
                dieTileMap[x][y] = color;
            }
        }
        
        this.castle.well_tiles = dieTiles;
        
        let dieTileMapIndex = 0;
        for(let room of Object.keys(this.castle.levels[2].rooms)) {
            const colors = dieTileMap[dieTileMapIndex];
            let actions = {};
            
            for(let color of colors) {
                if(!actions[color]) actions[color] = [];
            }
            
            this.castle.levels[2].rooms[room] = {
                die_value: 4,
                initial_die_value: 4,
                max_die_count: this.player_count > 2 ? 2 : 1,
                card: {},
                colors: colors,
                actions: actions
            };
            
            dieTileMapIndex++;
        }
        
        for(let room of Object.keys(this.castle.levels[1].rooms)) {
            const colors = dieTileMap[dieTileMapIndex];
            let actions = {};
            
            for(let color of colors) {
                if(!actions[color]) actions[color] = [];
            }
            
            this.castle.levels[1].rooms[room] = {
                die_value: 3,
                initial_die_value: 3,
                card: {},
                colors: colors,
                actions: actions
            };
            
            dieTileMapIndex++;
        }
        
        this.setCastleRooms(2, 2);
        this.setCastleRooms(1, 3);
        
        const level3Cards = require('.././game_data/card_castle_level3.json');
        const level3Card = level3Cards[Math.floor(Math.random() * (level3Cards.length - 1))];

        let bonuses = [];

        for (let action of level3Card.actions) {
            let bonus = action;
            bonus.occupied = false;
            bonuses.push(bonus);
        }

        this.castle.levels.push({
            level: 3,
            clan_point: 10,
            image: level3Card.image,
            courtiers: {},
            bonus: bonuses
        });
    }
    
    setCastleRooms(level, roomCount) {
        let floorCards = require(`.././game_data/card_castle_level${level}.json`);
        if (this.player_count < 3) {
            floorCards = floorCards.filter((card) => card.player_min_count == 2);
        }

        this[`deck_castle_level${level}`] = [...floorCards].sort(() => Math.random() - 0.5);
        for (let i = 1; i <= roomCount; i++) {
            const floorCard = this[`deck_castle_level${level}`].pop();
            const room = this.castle.levels[level].rooms[`room${i}`];

            this.setRoomCard(room, floorCard);
        }
    }
    
    setRoomCard(room, card) {
        room.card = card;
        for (let i = 0; i < room.colors.length; i++) {
            room.actions[room.colors[i]].push(card.sections[i]);
        }
    }
    
    setWell() {
        
    }
    
    setYard() {
        
    }
    
    setGarden() {
        
    }
}

module.exports = Board;