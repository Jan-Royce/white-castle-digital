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
        
        const plusIcon = new Phaser.GameObjects.Text(this.scene, 154, 32, "+", {
            fontSize: '32px',
            color: '#ffffff'
        });
        plusIcon.setStroke('#000', 4);
        gfx.add(plusIcon);
        
        const daimyoIcon = new Phaser.GameObjects.Sprite(this.scene, 100, 20, 'icon_daimyo');
        daimyoIcon.setDisplaySize(60, 60);
        daimyoIcon.setOrigin(0);
        gfx.add(daimyoIcon);
        
        let ypos = 10;
        for(let tile of tiles) {
            let key = "";
            if(tile.action.type == 'resource') {
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
            scoreGfx: this.createCastleScoreGfx(data.clan_point, spaceWidth),
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
    
    createCastleScoreGfx(point, containerWidth) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        const xOffset = containerWidth * 3 / 5;
        
        const courtierIcon = new Phaser.GameObjects.Sprite(this.scene, xOffset, 4, 'unit_courtier');
        courtierIcon.setDisplaySize(30, 30);
        courtierIcon.setTint(0xbbbbbb);
        courtierIcon.setOrigin(0);
        gfx.add(courtierIcon);
        
        const clanPointIcon = new Phaser.GameObjects.Sprite(this.scene, xOffset + 44, 4, 'icon_clan_point_end_game');
        clanPointIcon.setDisplaySize(36, 36);
        clanPointIcon.setOrigin(0);
        gfx.add(clanPointIcon);
        
        const clanPoint = new Phaser.GameObjects.Text(this.scene, xOffset + 30, 4, `:  ${point}`, {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#000'
        });
        clanPoint.setStroke('#fff', 4);
        clanPoint.setOrigin(0);
        gfx.add(clanPoint);
        
        return gfx;
    }
    
    // TODO: create reusable game objects for icon+text combinations
    createGateGfx() {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, -50);
        
        const coinIcon = new Phaser.GameObjects.Sprite(this.scene, 4, 0, 'icon_coin');
        coinIcon.setDisplaySize(30, 30);
        coinIcon.setOrigin(0);
        gfx.add(coinIcon);
        
        const coinCost = new Phaser.GameObjects.Text(this.scene, 0, 4, "2", {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#f74e4e'
        });
        coinCost.setStroke('#fff', 4);
        gfx.add(coinCost);
        
        const arrow1 = new Phaser.GameObjects.Text(this.scene, 32, 4, ">", {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#000'
        });
        arrow1.setStroke('#fff', 4);
        gfx.add(arrow1);
        
        const courtierIcon1 = new Phaser.GameObjects.Sprite(this.scene, 52, 4, 'unit_courtier');
        courtierIcon1.setDisplaySize(20, 20);
        courtierIcon1.setTint(0xbbbbbb);
        courtierIcon1.setOrigin(0);
        gfx.add(courtierIcon1);
        
        const gateIcon = new Phaser.GameObjects.Text(this.scene, 64, 4, "(GATE)", {
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#000'
        });
        gateIcon.setStroke('#fff', 4);
        gfx.add(gateIcon);
        
        const lineText = new Phaser.GameObjects.Text(this.scene, 0, 8, "___________", {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#000'
        });
        lineText.setStroke('#fff', 4);
        gfx.add(lineText);
        
        const pearlIcon1 = new Phaser.GameObjects.Sprite(this.scene, 4, 26, 'icon_pearl');
        pearlIcon1.setDisplaySize(32, 32);
        pearlIcon1.setOrigin(0);
        gfx.add(pearlIcon1);
        
        const pearlCost1 = new Phaser.GameObjects.Text(this.scene, 0, 32, "2", {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#f74e4e'
        });
        pearlCost1.setStroke('#fff', 4);
        gfx.add(pearlCost1);
        
        const arrow2 = new Phaser.GameObjects.Text(this.scene, 32, 32, ">", {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#000'
        });
        arrow2.setStroke('#fff', 4);
        gfx.add(arrow2);
        
        const courtierIcon2 = new Phaser.GameObjects.Sprite(this.scene, 52, 32, 'unit_courtier');
        courtierIcon2.setDisplaySize(20, 20);
        courtierIcon2.setTint(0xbbbbbb);
        courtierIcon2.setOrigin(0);
        gfx.add(courtierIcon2);
        
        const up1 = new Phaser.GameObjects.Text(this.scene, 44, 32, "^", {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#33b359'
        });
        up1.setStroke('#fff', 4);
        gfx.add(up1);
        
        const slash = new Phaser.GameObjects.Text(this.scene, 68, 30, "/", {
            fontSize: '24px',
            fontStyle: 'bold',
            color: '#000'
        });
        slash.setStroke('#fff', 4);
        gfx.add(slash);
        
        const pearlIcon2 = new Phaser.GameObjects.Sprite(this.scene, 84, 26, 'icon_pearl');
        pearlIcon2.setDisplaySize(32, 32);
        pearlIcon2.setOrigin(0);
        gfx.add(pearlIcon2);
        
        const pearlCost2 = new Phaser.GameObjects.Text(this.scene, 80, 32, "5", {
            fontSize: '20px',
            fontStyle: 'bold',
            color: '#f74e4e'
        });
        pearlCost2.setStroke('#fff', 4);
        gfx.add(pearlCost2);
        
        const arrow3 = new Phaser.GameObjects.Text(this.scene, 110, 32, ">", {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#000'
        });
        arrow3.setStroke('#fff', 4);
        gfx.add(arrow3);
        
        const courtierIcon3 = new Phaser.GameObjects.Sprite(this.scene, 130, 32, 'unit_courtier');
        courtierIcon3.setDisplaySize(20, 20);
        courtierIcon3.setTint(0xbbbbbb);
        courtierIcon3.setOrigin(0);
        gfx.add(courtierIcon3);
        
        const up2 = new Phaser.GameObjects.Text(this.scene, 122, 32, "^^", {
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#33b359'
        });
        up2.setStroke('#fff', 4);
        gfx.add(up2);
        
        return gfx;
    }
}