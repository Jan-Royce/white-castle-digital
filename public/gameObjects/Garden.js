import { BoardSpace } from './BoardSpace.js';

export class Garden extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, gardenData, colorMap, bridgeHeight } = config;

        super(scene, x, y);

        this.color_map = colorMap;
        this.width = w;
        this.height = h;
        this.garden_plots = [];
        this.bridge_height = bridgeHeight;
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height, 0xd378a2);
        background.setOrigin(0);
        background.setAlpha(0);
        this.add(background);
        
        this.addGardenPlots(gardenData);
    }
    
    addGardenPlots(gardens) {
        const bridgeOrder = ['red', 'black', 'white'];
        
        const plotWidth = (this.width / 2) - 10;
        const plotHeight = 110;
        
        const yOffset = 10;
        const plotOffset = 8;
        const spaceTotal = this.height - (this.bridge_height * bridgeOrder.length) - (yOffset * 2);
        const spaceBetween = Math.floor(spaceTotal / bridgeOrder.length);
        const bridgeOffsetGrowth = spaceBetween + this.bridge_height;
        const unitSize = 24;
        
        let yPos = yOffset + this.bridge_height + plotOffset;
        let xPos = 10;
        for(const color of bridgeOrder) {
            const plots = gardens[color];
            this.garden_plots[color] = [];
            
            xPos = 10;
            
            for(let i=0; i<plots.length; i++) {
                console.log(plots[i])
                const gardenPlot = new BoardSpace({
                    scene: this.scene,
                    x: xPos,
                    y: yPos,
                    spaceId: `garden_plot_${color}_${i == 0 ? 'stone' : 'plant'}`,
                    bridge: color,
                    width: plotWidth,
                    height: plotHeight,
                    color: i == 0 ? 0xbd7575 : 0x9ecc90,
                    gfx: this.createGardenPlotGfx(plots[i], plotWidth, plotHeight),
                    scoreGfx: this.createGardenScoreGfx(plotWidth, plots[i].clan_point),
                    unitType: 'gardener',
                    unitPos: { x: 4, y: 4, wrap_per: 2 },
                    unitCount: false,
                    unitSize: unitSize,
                    colorMap: this.color_map
                });
                
                this.add(gardenPlot);
                this.garden_plots[color].push(gardenPlot);
                
                xPos += plotWidth;
            }
            
            yPos += bridgeOffsetGrowth;
        }
    }
    
    //TODO TEMP display before adding gfx
    createGardenPlotGfx(plot, plotW, plotH) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        // gfx.y = (plotH - 14) / 2;
        
        const iconSize = 30;
        const foodIcon = new Phaser.GameObjects.Sprite(this.scene, 6, 0, 'icon_food');
        foodIcon.setDisplaySize(iconSize, iconSize);
        foodIcon.setOrigin(0);
        gfx.add(foodIcon);
        
        const costTxt = new Phaser.GameObjects.Text(this.scene, 2, 0, plot.cost, {
            fontSize: `18px`,
            fontStyle: 'bold',
            color: '#a72e2e'
        });
        costTxt.setStroke('#fff', 4);
        costTxt.setOrigin(0);
        costTxt.y = iconSize/4 - 4;
        gfx.add(costTxt);
        
        let actionSprite = new Phaser.GameObjects.Sprite(this.scene, plotW/2, plotH/2 + 8, plot.image);
        // actionSprite.setDisplaySize(40, 80);
        actionSprite.setScale(0.2);
        actionSprite.x = (actionSprite.displayWidth)/2 + actionSprite.x;
        gfx.add(actionSprite);
        
        return gfx;
    }
    
    createGardenScoreGfx(plotW, score) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 4);
        
        const spr = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `score_garden_${score}`);
        spr.setScale(0.18);
        spr.setOrigin(0);
        spr.x = plotW - spr.displayWidth;
        gfx.add(spr);
        
        return gfx;
    }
}