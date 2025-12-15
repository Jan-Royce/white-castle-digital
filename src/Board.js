class Board {
    constructor(config) {
        const { playerCount, matchaExpansion, dieTilePromo, colorMap, devMode } = config;
        
        this.dev_mode = devMode;
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
        this.outside_walls = {
            //dice
            garden_castle: [],
            castle_yard: [],
        };
        
        this.setBridges();
        
        let dieTiles = require('.././game_data/die_tiles.json');
        if(this.die_tile_promo) {
            dieTiles = dieTiles.filter((tile) => !tile.tag || tile.tag != 'any_resource');
        } else {
            dieTiles = dieTiles.filter((tile) => !tile.tag || tile.tag != 'promo1');
        }
        dieTiles = this.shuffle(dieTiles);
        
        this.setCastle(dieTiles);
        
        this.setYard();
        this.setGarden();
        
        if(devMode) {
            let starting = require('.././game_data/card_starting_resource.json');
            if(!this.matcha_expansion) {
                starting = starting.filter((card) => card.tag != 'matcha');
            }
            starting = this.shuffle(starting);
            
            const card = starting.pop();
            
            this.starting_lantern = card.lantern;
        }
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
        
        this.castle.levels.push({
            level: 1,
            clan_point: 3,
            rooms: {
                "room1": {},
                "room2": {},
                "room3": {}
            }
        });
        
        this.castle.levels.push({
            level: 2,
            clan_point: 6,
            rooms: {
                "room1": {},
                "room2": {}
            }
        });
        
        let dieTileColors = ['black', 'red', 'white'];
        dieTileColors = this.shuffle(dieTileColors);
        
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
                actions: actions,
                courtiers: {}
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
                max_die_count: this.player_count > 2 ? 2 : 1,
                card: {},
                colors: colors,
                actions: actions,
                courtiers: {}
            };
            
            dieTileMapIndex++;
        }
        
        this.setCastleRooms(2, 2);
        this.setCastleRooms(1, 3);
        
        const level3Cards = require('.././game_data/card_castle_level3.json');
        const level3Card = level3Cards[Math.floor(Math.random() * (level3Cards.length))];

        let bonuses = [];

        for (let action of level3Card.actions) {
            let bonus = action;
            bonus.courtiers = {};
            
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

        this[`deck_castle_level${level}`] = this.shuffle(floorCards);
        for (let i = 1; i <= roomCount; i++) {
            const floorCard = this[`deck_castle_level${level}`].pop();
            const room = this.castle.levels[level].rooms[`room${i}`];

            this.setRoomCard(room, floorCard);
        }
    }
    
    setRoomCard(room, card) {
        room.card = card;
        for (let i = 0; i < room.colors.length; i++) {
            const section = card.sections[i];
            room.actions[room.colors[i]].push(card.sections[i]);
        }
        room.card_sections = card.sections;
    }
    
    setYard() {
        let yardTilesBlue = require('.././game_data/tile_yard_blue.json');
        yardTilesBlue = this.shuffle(yardTilesBlue);
        let yardTilesYellow = require('.././game_data/tile_yard_yellow.json');
        yardTilesYellow = this.shuffle(yardTilesYellow);
        
        this.yard.push(
            {
                level: 3,
                cost: 5,
                multiplier: 2,
                warriors: {},
                actions: [yardTilesBlue.pop(), yardTilesYellow.pop()]
            },
            {
                level: 2,
                cost: 3,
                multiplier: 1,
                warriors: {},
                actions: [yardTilesBlue.pop()]
            },
            {
                level: 1,
                cost: 1,
                multiplier: 1,
                warriors: {},
                actions: [yardTilesYellow.pop()]
            }
        );
    }
    
    setGarden() {
        this.garden.red = [];
        this.garden.black = [];
        this.garden.white = [];
        
        let stoneGardens = require('.././game_data/card_stone_garden.json');
        stoneGardens = this.shuffle(stoneGardens);
        let plantGardens = require('.././game_data/card_plant_garden.json');
        plantGardens = this.shuffle(plantGardens);
        
        for(const [color, bridge] of Object.entries(this.garden)) {
            const stoneGarden = stoneGardens.pop();
            stoneGarden.gardeners = {};
            this.garden[color].push(stoneGarden);
            
            const plantGarden = plantGardens.pop();
            plantGarden.gardeners = {};
            this.garden[color].push(plantGarden);
        }
    }
    
    generateTestUnits() {
        this.clearAllUnits();
        
        for(const id of Object.keys(this.color_map)) {
            if(Math.floor(Math.random() * 2) > 0) {
                this.castle.levels[0].courtiers[id] = Math.floor(Math.random() * 3 + 1);
            }

            let level1RoomId = Math.floor(Math.random() * 3 + 1);
            let level2RoomId = Math.floor(Math.random() * 2 + 1);
            this.castle.levels[1].rooms[`room${level1RoomId}`].courtiers[id] = Math.floor(Math.random() * 3 + 1);
            this.castle.levels[2].rooms[`room${level2RoomId}`].courtiers[id] = Math.floor(Math.random() * 3 + 1);
            this.castle.levels[3].courtiers[id] = Math.floor(Math.random() * 3 + 1);
        }
        
        for(let i=0; i<this.castle.levels[3].bonus.length; i++) {
            const bonus = this.castle.levels[3].bonus[i];
            
            if(Math.floor(Math.random() * 2) > 0) {
                let player = Object.keys(this.color_map)[Math.floor(Math.random() * this.player_count)];
                bonus.courtiers[player] = 1;
            }
        }
        
        for(const id of Object.keys(this.color_map)) {
            if(Math.floor(Math.random() * 2) > 0) {
                this.yard[0].warriors[id] = Math.floor(Math.random() * 3 + 1);
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.yard[1].warriors[id] = Math.floor(Math.random() * 3 + 1);
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.yard[2].warriors[id] = Math.floor(Math.random() * 3 + 1);
            }
        }
        
        let gardenerCount = 5;
        for (const id of Object.keys(this.color_map)) {
            if(Math.floor(Math.random() * 2) > 0) {
                this.garden.red[0].gardeners[id] = 1;
                gardenerCount--;
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.garden.red[1].gardeners[id] = 1;
                gardenerCount--;
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.garden.black[0].gardeners[id] = 1;
                gardenerCount--;
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.garden.black[1].gardeners[id] = 1;
                gardenerCount--;
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.garden.white[0].gardeners[id] = 1;
                gardenerCount--;
            }
            
            if(gardenerCount <= 0) {
                gardenerCount = 5;
                continue;
            }
            
            if(Math.floor(Math.random() * 2) > 0) {
                this.garden.white[1].gardeners[id] = 1;
                gardenerCount--;
            }
        }
    }
    
    clearAllUnits() {
        this.clearCastleUnits();
        this.clearYardUnits();
        this.clearGardenUnits();
    }
    
    clearCastleUnits() {
        this.castle.levels[0].courtiers = {};
        this.castle.levels[1].rooms['room1'].courtiers = {};
        this.castle.levels[1].rooms['room2'].courtiers = {};
        this.castle.levels[1].rooms['room3'].courtiers = {};
        this.castle.levels[2].rooms['room1'].courtiers = {};
        this.castle.levels[2].rooms['room2'].courtiers = {};
        this.castle.levels[3].courtiers = {};

        this.castle.levels[3].bonus[0].courtiers = {};
        this.castle.levels[3].bonus[1].courtiers = {};
        this.castle.levels[3].bonus[2].courtiers = {};
    }
    
    clearYardUnits() {
        this.yard[0].warriors = {};
        this.yard[1].warriors = {};
        this.yard[2].warriors = {};
    }
    
    clearGardenUnits() {
        this.garden.red[0].gardeners = {};
        this.garden.red[1].gardeners = {};
        this.garden.black[0].gardeners = {};
        this.garden.black[1].gardeners = {};
        this.garden.white[0].gardeners = {};
        this.garden.white[1].gardeners = {};
    }
    
    shuffle(arr) {
        return [...arr].sort(() => Math.random() - 0.5);
    }
}

module.exports = Board;