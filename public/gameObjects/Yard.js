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
    
    createYardGfx(tiles, yardWidth, yardHeight) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        let xPos = 0;
        for(const tile of tiles) {
            const yardTile = this.createYardTile(tile, {w: yardWidth, h: yardHeight});
            yardTile.x = xPos;
            gfx.add(yardTile);
            
            xPos += yardWidth * 0.4;
        }
        
        return gfx;
    }
    
    // TODO CONTINUE HERE : fix centering for all instances
    // change icon size for certain icons
    // action: iron_or_food_or_pearl_2 needs to have text overlay
    createYardTile(tile, dimensions) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const tileW = dimensions.w * 0.4;
        const tileH = dimensions.h / 3;
        
        let color = tile.color == 'blue' ? '#88e9f0' : '#e0f088';
        const background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, tileW, tileH, parseInt(color.replace(/^#/, ''), 16));
        background.setOrigin(0);
        gfx.add(background);
        
        let tileSprSize = 40;
        
        if(tile.type == 'action') {
            const name = tile.name;
            const icon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `icon_${name}`);
            icon.setDisplaySize(tileSprSize, tileSprSize);
            icon.setOrigin(0);
            icon.x = (tileW - icon.displayWidth) / 2;
            icon.y = (tileH - icon.displayHeight) / 2;
            
            gfx.add(icon);
        } else {
            if(Object.entries(tile.resources).length > 1) tileSprSize = 30;
            
            let xPos = 0;
            const fontSize = 20;
            
            for(const [resource, count] of Object.entries(tile.resources)) {
                let iconWrap = new Phaser.GameObjects.Container(this.scene, xPos, 0);
                
                let icon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `icon_${resource}`);
                icon.setDisplaySize(tileSprSize, tileSprSize);
                icon.setOrigin(0);
                
                let countTxt = new Phaser.GameObjects.Text(this.scene, icon.displayWidth - fontSize / 2, (icon.displayHeight - fontSize) / 2, count, {
                    fontSize: `${fontSize}px`,
                    fontStyle: 'bold',
                    color: '#000'
                });
                countTxt.setStroke('#fff', 4);
                countTxt.setOrigin(0);
                
                console.log(iconWrap.displayWidth)
                iconWrap.x = (tileW - (tileSprSize + xPos)) / 2;
                
                iconWrap.add(icon);
                iconWrap.add(countTxt);
                
                gfx.add(iconWrap);
                
                xPos += tileSprSize + 20;
            }
        }
        
        return gfx;
    }
    
    createYardScoreGfx(yardDimensions, multiplier, cost) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);

        const costSpr = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `cost_yard_${cost}`);
        costSpr.setScale(0.15);
        costSpr.setOrigin(0);
        costSpr.y = yardDimensions.h - costSpr.displayHeight;
        gfx.add(costSpr);
        
        const scoreSpr = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `score_yard_${multiplier}`);
        scoreSpr.setScale(0.2);
        scoreSpr.setOrigin(0);
        scoreSpr.x = yardDimensions.w - scoreSpr.displayWidth;
        scoreSpr.y = yardDimensions.h- scoreSpr.displayHeight;
        gfx.add(scoreSpr);

        return gfx;
    }
}