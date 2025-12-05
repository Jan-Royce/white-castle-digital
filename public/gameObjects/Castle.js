import { BoardSpace } from './BoardSpace.js';

export class Castle extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, board, castleData, colorMap } = config;

        super(scene, x, y);
        
        this.x = 320;
        this.color_map = colorMap;
        this.width = w;
        this.height = h;
        this.board = board;
        this.levels = [];
        this.die_spaces = [];
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height, 0xa9dff5);
        background.setOrigin(0);
        this.add(background);
        
        this.addLevels(castleData.levels);
        this.addWell(castleData.well_tiles);
    }
    
    addLevels(levels) {
        for(let level of levels) {
            if(level.level == 0) {
                const gate = this.addCastleGate(level);
                this.add(gate);
                this.levels.push(gate);
            } else {
                const floor = level.level < 3 ? this.addCastleFloor(level) : this.addCastleTopFloor(level);
                this.add(floor);
                this.levels.push(floor);
            }
        }
    }
    
    addWell(tiles) {
        const wellActions = [
            tiles[0].action,
            tiles[1].action
        ];
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
                always_show: true,
                board: this.board,
                actions: wellActions
            }
        });
        this.add(well);
        this.well = well;
        this.well_actions = wellActions;
        this.well.die_space.board_space = well;
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
            spaceId: 'castle_gate',
            width: spaceWidth,
            height: 100,
            color: 0xe2ab7e,
            scoreGfx: this.createCastleScoreGfx(spaceWidth, data.level),
            gfx: this.createGateGfx(),
            unitType: 'courtier',
            colorMap: this.color_map
        });
        
        return gate;
    }
    
    createCastleScoreGfx(spaceWidth, level) {
        const scoreGfx = ['score_castle_1', 'score_castle_3', 'score_castle_6', 'score_castle_10'];
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const spr = new Phaser.GameObjects.Sprite(this.scene, spaceWidth - 80, 4, scoreGfx[level]);
        spr.setScale(0.225);
        spr.setOrigin(0);
        gfx.add(spr);
        
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
        const floorHeight = this.height - (150 + data.level * 140) - ((data.level - 1) * 20);
        const floorWidth = data.level == 1 ? 520 : 420;
        const roomWidth = 160;
        const roomHeight = 120;
        const xOffset = data.level == 1 ? 10 : 60;
        const color = data.level == 1 ? 0xdfd39d : 0x6e81d8;
        
        const floor = new Phaser.GameObjects.Container(this.scene, xOffset, floorHeight);
        const floorBg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, floorWidth, 140, color);
        floorBg.setOrigin(0);
        floor.add(floorBg);
        
        const roomColor = data.level == 1 ? 0x7e7756 : 0x5563a0;
        
        const roomSideOffset = 10;
        let roomXOffset = roomSideOffset;
        const roomCount = Object.keys(data.rooms).length;
        const spaceTotal = floorWidth - (roomCount * roomWidth);
        const spaceBetween = (spaceTotal - (2 * roomSideOffset)) / (roomCount - 1);
        const roomXOffsetGrowth = roomWidth + spaceBetween;
        
        for(const [roomId, roomData] of Object.entries(data.rooms)) {
            const room = new BoardSpace({
                scene: this.scene,
                x: roomXOffset,
                y: 10,
                spaceId: `castle_level${data.level}_${roomId}`,
                floorId: data.level,
                roomId: roomId,
                width: roomWidth,
                height: roomHeight,
                color: roomColor,
                scoreGfx: this.createCastleScoreGfx(150, data.level),
                gfx: this.createRoomGfx(roomData, roomWidth, roomHeight),
                unitType: 'courtier',
                unitPos: { x: 0, y: 0, wrap_per: 2 },
                unitSize: 24,
                colorMap: this.color_map,
                dieSpace: {
                    x: 4,
                    y: 4,
                    die_value: roomData.die_value,
                    die_size: 40,
                    max_die_count: roomData.max_die_count,
                    board: this.board,
                    actions: roomData.actions
                }
            });
            
            roomXOffset += roomXOffsetGrowth;
            
            let tileYpos = 32;
            for(const tileColor of roomData.colors) {
                const tile = new Phaser.GameObjects.Sprite(this.scene, roomWidth/3, tileYpos, `tile_${tileColor}`);
                tile.setDisplaySize(24, 24);
                tile.setOrigin(0);
                tileYpos += roomData.colors.length == 3 ? 28 : 56;
                
                room.add(tile);
            }
            
            floor.add(room);
            
            room.die_space.color_restrictions = Object.keys(roomData.actions);
            this.die_spaces.push(room.die_space);
        }
        
        return floor;
    }
    
    // TODO/NOTE alternative to just rendering cards directly, maybe do pngs for icon sets
    createRoomGfx(room, roomWidth, roomHeight) {
        const cardW = 54;
        const cardH = 90;
        
        const cardXOffset = 6;
        const cardYOffset = 6;
        
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        gfx.x = roomWidth - cardW - cardXOffset;
        gfx.y = roomHeight - cardH - cardYOffset;
        
        const card = new Phaser.GameObjects.Sprite(this.scene, 0, 0, room.card.image);
        card.setDisplaySize(cardW, cardH);
        card.setOrigin(0);
        gfx.add(card);
        
        return gfx;
    }
    
    addCastleTopFloor(data) {
        const roomWidth = 340;
        const roomHeight = 140;
        const offsetX = (this.width - roomWidth) / 2;
        
        const room = new BoardSpace({
            scene: this.scene,
            x: offsetX,
            y: 10,
            spaceId: `castle_top`,
            width: roomWidth,
            height: roomHeight,
            color: 0x99c281,
            scoreGfx: this.createCastleScoreGfx(roomWidth - 20, data.level),
            gfx: this.createCastleTopGfx(roomHeight),
            unitType: 'courtier',
            unitPos: { x: roomWidth-60, y: 0, wrap_per: 2 },
            unitSize: 24,
            colorMap: this.color_map
        });
        
        let bonusX = 85;
        let spaceW = 56;
        let spaceH = 96;
        for(let i=0; i<data.bonus.length; i++) {
            const bonus = data.bonus[i];
            
            const castleBonus = new BoardSpace({
                scene: this.scene,
                x: bonusX,
                y: 36,
                spaceId: `castle_top_bonus${i+1}`,
                width: spaceW,
                height: spaceH,
                color: 0xdd9d9d,
                noBackground: true,
                unitType: 'courtier',
                unitPos: { x: 2, y: -12 },
                unitCount: false,
                unitSize: 54,
                colorMap: this.color_map
            });
            
            if(bonus.type == 'action') {
                let bonusIcon = new Phaser.GameObjects.Sprite(this.scene, spaceW / 2, 16, `icon_${bonus.name}`);
                bonusIcon.setDisplaySize(40, 40);
                castleBonus.add(bonusIcon);
            } else {
                for(const [resource, count] of Object.entries(bonus.resources)) {
                    let bonusIcon = new Phaser.GameObjects.Sprite(this.scene, spaceW/2, 16, `icon_${resource}`);
                    bonusIcon.setDisplaySize(40, 40);
                    let bonusTxtGfx = new Phaser.GameObjects.Text(this.scene, spaceW/2+8, 8, count, {
                        fontSize: '20px',
                        fontStyle: 'bold',
                        color: '#000'
                    });
                    bonusTxtGfx.setStroke('#fff', 4);
                    bonusTxtGfx.setOrigin(0);
                    
                    castleBonus.add(bonusIcon);
                    castleBonus.add(bonusTxtGfx);
                }
            }
            
            room.add(castleBonus);
            
            bonusX += 60;
        }
        
        return room;
    }
    
    createCastleTopGfx(roomHeight) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 4, roomHeight/4);
        
        const bg = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'gfx_castle_top');
        bg.setScale(0.225);
        bg.setOrigin(0);
        gfx.add(bg);
        
        const bonuses = new Phaser.GameObjects.Sprite(this.scene, 80, 0, 'gfx_castle_bonus');
        bonuses.setScale(0.28);
        bonuses.setOrigin(0);
        gfx.add(bonuses);

        return gfx;
    }
}