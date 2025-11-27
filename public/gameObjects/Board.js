import { Bridge } from './Bridge.js';
import { Castle } from './Castle.js';
import { BoardSpace } from './BoardSpace.js';

export class Board extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, boardData } = config;
        
        super(scene, x, y);
        
        this.color_map = boardData.color_map;
        this.bridges = {};
        
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        
        this.setSize(width * 0.85, height * 0.85);
        this.x = width * 0.15;
        this.y = 40;
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height, 0x9a9ed4);
        background.setOrigin(0);
        this.add(background);
        
        this.scene.add.existing(this);
        
        this.setUpBridges(boardData.bridges);
        this.setUpCastle(boardData.castle);
        this.setUpOutsideWalls(boardData.player_count, {w: this.width, h: this.height});
    }
    
    setUpBridges(bridgeData) {
        let yPos = 20;
        for(const [color, dice] of Object.entries(bridgeData)) {
            let bridge = new Bridge({
                scene: this.scene,
                x: 0,
                y: yPos,
                color: color,
                dice: dice
            });
            
            this.bridges[color] = bridge;
            this.add(bridge);
            
            yPos += 200;
        }
    }
    
    setUpCastle(castleData) {
        const castle = new Castle({
            scene: this.scene,
            x: 0,
            y: 0,
            height: this.height,
            castleData: castleData,
            colorMap: this.color_map
        });
        this.add(castle);
        this.castle = castle;
    }
    
    setUpOutsideWalls(playerCount, boardDimensions) {
        const width = 220;
        const height = 120;
        const outside = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const outsideBg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, width, height, 0xb4d170);
        outsideBg.setOrigin(0);
        outside.add(outsideBg);
        
        const gfx = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'gfx_outside_wall');
        gfx.setScale(0.25);
        gfx.setOrigin(0);
        gfx.x = (width - gfx.displayWidth) / 2;
        gfx.y = (height - gfx.displayHeight) / 2;
        outside.add(gfx);
        outside.bringToTop(gfx);
        
        outside.x = boardDimensions.w - width - 20;
        outside.y = boardDimensions.h - height - 10;
        
        const ids = ['garden_castle', 'castle_yard'];
        const dieSize = 36;
        
        let xPos = 0;
        for(let i=0; i<2; i++) {
            const boardSpace = new BoardSpace({
                scene: this.scene,
                x: xPos,
                y: 0,
                spaceId: ids[i],
                width: width / 2,
                height: height,
                noBackground: true,
                dieSpace: {
                    x: (width/2 - dieSize) / 2 - (i > 0 ? 1 : -1) * 10,
                    y: (height - dieSize) / 2,
                    die_value: 5,
                    die_size: dieSize,
                    max_die_count: playerCount > 2 ? 2 : 1
                }
            });

            outside.add(boardSpace);
            
            xPos += width/2;
        }
        
        this.add(outside);
        this.outside_walls = outside;
    }
}