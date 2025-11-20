import { BoardSpace } from './BoardSpace.js';

export class Castle extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, height, castleData, colorMap } = config;

        super(scene, x, y);
        
        this.x = 320;
        this.color_map = colorMap;
        this.height = height;
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, 540, height, 0xdfd39d);
        background.setOrigin(0);
        this.add(background);
        
        this.addLevels(castleData.levels);
        this.addWell(castleData.well_tiles);
    }
    
    addLevels(levels) {
        console.log(levels)
        for(let level of levels) {
            if(level.level == 0) {
                this.addCastleGate(level);
            } else {
                console.log('create rooms')
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
            scoreGfx: this.createCastleScoreGfx(spaceWidth),
            gfx: this.createGateGfx(),
            units: data.courtiers,
            unitType: 'courtier',
            colorMap: this.color_map
        });
        this.add(gate);
        this.gate = gate;
        
        /* for testing courtiers in gate
        gate.updateUnitDisplay();
        //would need to uncomment loop on Board.setCastle() on backend
        //*/
    }
    
    createCastleScoreGfx(spaceWidth) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const bg = new Phaser.GameObjects.Sprite(this.scene, spaceWidth-80, 4, 'score_castle_1');
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
}