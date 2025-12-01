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
        const unitSize = 36;
        
        for (let yard of levels) {
            const unitPosX = (yardWidth - unitSize * 4) / 2;
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
                unitPos: { x: unitPosX, y: 10 },
                unitSize: unitSize,
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
            
            xPos += yardWidth * 0.4 + 8;
        }
        
        return gfx;
    }
    
    createYardTile(tile, dimensions) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        
        const tileW = dimensions.w * 0.4;
        const tileH = dimensions.h / 3;
        
        let color = tile.color == 'blue' ? '#88e9f0' : '#e0f088';
        const background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, tileW, tileH, parseInt(color.replace(/^#/, ''), 16));
        background.setOrigin(0);
        gfx.add(background);
        
        let tileSprSize = 40;
        
        let name = tile.name;
        if(tile.type == 'action' && name != 'iron_or_food_or_pearl_2') {
            const icon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `icon_${name}`);
            
            icon.setDisplaySize(tileSprSize, tileSprSize);
            icon.setOrigin(0);
            icon.x = (tileW - icon.displayWidth) / 2;
            icon.y = (tileH - icon.displayHeight) / 2;
            
            gfx.add(icon);
        } else if(tile.type == 'action' && name == 'iron_or_food_or_pearl_2') {
            const iconWrap = this.createIconWrap(
                {
                    x: (tileW - tileSprSize) / 2,
                    y: (tileH - tileSprSize) / 2
                },
                {
                    name: 'icon_iron_or_food_or_pearl',
                    size: tileSprSize
                },
                {
                    content: 2,
                    font_size: 20
                }
            );

            gfx.add(iconWrap);
        } else {
            const iconCount = Object.entries(tile.resources).length;
            let xPos = (tileW - tileSprSize) / 2;
            let xPosGrowth = 10;
            
            if(iconCount > 1) {
                tileSprSize = 28;
                const gapSize = (tileW - tileSprSize * iconCount) / (iconCount + 1);
                xPos = gapSize;
                xPosGrowth = gapSize + tileSprSize;
            }
            
            const fontSize = 20;
            
            for(const [resource, count] of Object.entries(tile.resources)) {
                const iconWrap = this.createIconWrap(
                    {
                        x: xPos,
                        y: (tileH - tileSprSize) / 2
                    }, 
                    {
                        name: `icon_${resource}`,
                        size: tileSprSize
                    },
                    {
                        content: count,
                        font_size: fontSize
                    }
                );
                
                gfx.add(iconWrap);
                
                xPos += xPosGrowth;
            }
        }
        
        return gfx;
    }
    
    createIconWrap(pos, spr, text) {
        let iconWrap = new Phaser.GameObjects.Container(this.scene, pos.x, pos.y);
        
        let icon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, spr.name);
        icon.setDisplaySize(spr.size, spr.size);
        icon.setOrigin(0);
        
        iconWrap.add(icon);
        
        if(text.content != '') {
            let countTxt = new Phaser.GameObjects.Text(this.scene, icon.displayWidth - text.font_size / 2, (icon.displayHeight - text.font_size) / 2, text.content, {
                fontSize: `${text.font_size}px`,
                fontStyle: 'bold',
                color: '#000'
            });
            countTxt.setStroke('#fff', 4);
            countTxt.setOrigin(0);
            
            iconWrap.add(countTxt);
        }
        
        return iconWrap;
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