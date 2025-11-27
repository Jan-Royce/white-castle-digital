import { Board } from './Board.js';
import { BoardSpace } from './BoardSpace.js';

export class Yard extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, yardData, colorMap } = config;
        
        super(scene, x, y);
        
        this.color_map = colorMap;
        this.width = w;
        this.height = h;
        this.levels = [];
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height, 0x72e472);
        background.setOrigin(0);
        this.add(background);
        
        this.addLevels(yardData);
    }
    
    addLevels(levels) {
        const yardHeight = (this.height - 40) / 3;
        const yardWidth = this.width - 20;
        const offset = 10;
        let yPos = offset;
        const spaceTotal = this.height - (yardHeight * 3);
        const spaceBetween = (spaceTotal - (2 * offset)) / 2;
        const offsetGrowth = yardHeight + spaceBetween;
        
        for (let yard of levels) {
            console.log(yard)
            const yardLevel = new BoardSpace({
                scene: this.scene,
                x: (this.width - yardWidth) / 2,
                y: yPos,
                spaceId: `yard_level${yard.level}`,
                width: yardWidth,
                height: yardHeight,
                color: 0xb4f0b4,
                scoreGfx: this.createYardScoreGfx({w: yardWidth, h: yardHeight}, yard.multiplier, yard.cost),
                gfx: this.createYardGfx(yard.actions, yardWidth, yardHeight),
                unitType: 'warrior',
                unitPos: { x: 0, y: 0, wrap_per: 2 },
                unitSize: 20,
                colorMap: this.color_map
            });
            
            yPos += offsetGrowth;
            
            this.add(yardLevel);
            this.levels.push(yardLevel);
        }
    }
    
    // TODO yard tile gfx
    createYardGfx(tiles, yardWidth, yardHeight) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        let yPos = 10;
        for(const tile of tiles) {
            let theTile = "";
            
            if(tile.type == 'action') {
                theTile = tile.name;
            } else {
                theTile = JSON.stringify(tile.resources);
            }
            
            const tileAction = new Phaser.GameObjects.Text(this.scene, 10, yPos, theTile, {
                fontSize: '12px',
                fontStyle: 'bold',
                color: '#000',
                backgroundColor: tile.color == 'blue' ? '#88e9f0' : '#e0f088'
            });
            tileAction.setStroke('#fff', 4);
            tileAction.setOrigin(0);
            gfx.add(tileAction);
            
            yPos += 30;
        }
        
        return gfx;
    }
    
    createYardScoreGfx(yardDimensions, multiplier, cost) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);

        const iconSize = 40;
        const costGfx = this.createCostGfx(cost, iconSize);
        costGfx.y = yardDimensions.h - iconSize;
        gfx.add(costGfx);
        
        const spr = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `score_yard_${multiplier}`);
        spr.setScale(0.2);
        spr.setOrigin(0);
        spr.x = yardDimensions.w - spr.displayWidth;
        spr.y = yardDimensions.h- spr.displayHeight;
        gfx.add(spr);

        return gfx;
    }
    
    // TODO create PNG gfx for this instead
    createCostGfx(cost, size) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const ironIcon = new Phaser.GameObjects.Sprite(this.scene, 8, 0, 'icon_iron');
        ironIcon.setDisplaySize(size, size);
        ironIcon.setOrigin(0);
        gfx.add(ironIcon);
        
        const spaceCost = new Phaser.GameObjects.Text(this.scene, 0, 6, cost, {
            fontSize: `28px`,
            fontStyle: 'bold',
            color: '#d72c2c'
        });
        spaceCost.setStroke('#fff', 2);
        spaceCost.setOrigin(0);
        gfx.add(spaceCost);
        
        return gfx;
    }
}