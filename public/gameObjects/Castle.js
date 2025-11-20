import { BoardSpace } from './BoardSpace.js';

export class Castle extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, height, castleData, colorMap } = config;

        super(scene, x, y);
        
        this.x = 320;
        this.color_map = colorMap;
        this.height = height;
        this.levels = [];
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, 540, height, 0xa9dff5);
        background.setOrigin(0);
        this.add(background);
        
        this.addLevels(castleData.levels);
        this.addWell(castleData.well_tiles);
    }
    
    addLevels(levels) {
        console.log(levels)
        for(let level of levels) {
            if(level.level == 0) {
                const gate = this.addCastleGate(level);
                this.add(gate);
                this.levels.push(gate);
            } else if(level.level < 3) {
                const floor = this.addCastleFloor(level);
                this.add(floor);
                this.levels.push(floor);
            } else {
                console.log('level 3')
                console.log(level)
                //level 
            }
            
        }
    }
    
    addWell(tiles) {
        const well = new BoardSpace({
            scene: this.scene,
            x: 20,
            y: this.height - 110,
            spaceId: 'well',
            width: 240,
            height: 100,
            color: 0xe1fcd1,
            gfx: this.createWellGfx(tiles),
            dieSpace: {
                die_value: 1,
                die_size: 50,
                max_die_count: Number.POSITIVE_INFINITY,
                always_show: true
            }
        });
        this.add(well);
        this.well = well;
    }
    
    createWellGfx(tiles) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const bg = new Phaser.GameObjects.Sprite(this.scene, 60, 20, 'gfx_well');
        bg.setScale(0.225);
        bg.setOrigin(0);
        gfx.add(bg);
        
        let ypos = 10;
        for (let tile of tiles) {
            let key = "";
            if (tile.action.type == 'resource') {
                key = Object.keys(tile.action.resources)[0];
            } else {
                key = tile.action.name;
            }

            const spr = new Phaser.GameObjects.Sprite(this.scene, 180, ypos, `tile_${key}`);
            spr.setDisplaySize(40, 40);
            spr.setOrigin(0);
            gfx.add(spr);

            ypos += 40;
        }
        
        return gfx;
    }
    
    addCastleGate(data) {
        const spaceWidth = 240;
        const gate = new BoardSpace({
            scene: this.scene,
            x: 280,
            y: this.height - 110,
            spaceId: 'gate',
            width: spaceWidth,
            height: 100,
            color: 0xe2ab7e,
            scoreGfx: this.createCastleScoreGfx(spaceWidth, data.level),
            gfx: this.createGateGfx(),
            units: data.courtiers,
            unitType: 'courtier',
            colorMap: this.color_map
        });
        
        /* for testing courtiers in gate
        gate.updateUnitDisplay();
        //would need to uncomment loop on Board.setCastle() on backend
        //*/
        
        return gate;
    }
    
    createCastleScoreGfx(spaceWidth, level) {
        const scoreGfx = ['score_castle_1', 'score_castle_3', 'score_castle_6', 'score_castle_10'];
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const bg = new Phaser.GameObjects.Sprite(this.scene, spaceWidth - 80, 4, scoreGfx[level]);
        bg.setScale(0.225);
        bg.setOrigin(0);
        gfx.add(bg);
        
        return gfx;
    }
    
    createGateGfx() {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, -40);
        
        const bg = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'gfx_gate');
        bg.setScale(0.15);
        bg.setOrigin(0);
        gfx.add(bg);
        
        return gfx;
    }
    
    addCastleFloor(data) {
        console.log(`level ${data.level}`)
        console.log(data)
        const height = this.height - (150 + data.level * 140) - ((data.level - 1) * 20);
        const floorWidth = data.level == 1 ? 520 : 420;
        const xOffset = data.level == 1 ? 10 : 60;
        const color = data.level == 1 ? 0xdfd39d : 0x6e81d8;
        
        const floor = new Phaser.GameObjects.Container(this.scene, xOffset, height);
        const floorBg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, floorWidth, 140, color);
        floorBg.setOrigin(0);
        floor.add(floorBg);
        
        const roomColor = data.level == 1 ? 0x7e7756 : 0x5563a0;
        let roomXOffset = 20;
        
        // TODO: figure out dynamic spacing, same concept for bridge dice spacing
        for(const [roomId, roomData] of Object.entries(data.rooms)) {
            console.log(roomId)
            console.log(roomData)
            
            const room = new BoardSpace({
                scene: this.scene,
                x: roomXOffset,
                y: 10,
                // y: height,
                spaceId: `level${data.level}_${roomId}`,
                width: 150,
                height: 120,
                color: roomColor,
                scoreGfx: this.createCastleScoreGfx(150, data.level),
                // gfx: this.createGateGfx(),
                units: data.courtiers,
                unitType: 'courtier',
                colorMap: this.color_map
            });
            roomXOffset += 164;
            
            let tileYpos = 0;
            for(const tileColor of roomData.colors) {
                const tile = new Phaser.GameObjects.Sprite(this.scene, 0, tileYpos, `tile_${tileColor}`);
                tile.setDisplaySize(32, 32);
                tile.setOrigin(0);
                tileYpos += 36;
                
                room.add(tile);
            }
            
            floor.add(room);
        }
        
        return floor;
    }
}