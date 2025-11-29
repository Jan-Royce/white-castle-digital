import { BoardSpace } from './BoardSpace.js';

export class Garden extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, gardenData, colorMap } = config;

        super(scene, x, y);

        this.color_map = colorMap;
        this.width = w;
        this.height = h;
        this.garden_plots = [];
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height, 0xd378a2);
        background.setOrigin(0);
        this.add(background);
        
        this.addGardenPlots(gardenData);
    }
    
    addGardenPlots(gardens) {
        const bridgeOrder = ['red', 'black', 'white'];
        const bridgeHeight = 60;
        
        const plotWidth = (this.width / 2) - 10;
        const plotHeight = 130;
        
        let yPos = 60;
        let xPos = 10;
        for(const color of bridgeOrder) {
            const plots = gardens[color];
            
            xPos = 10;
            
            for(let i=0; i<plots.length; i++) {
                const gardenPlot = new BoardSpace({
                    scene: this.scene,
                    x: xPos,
                    y: yPos,
                    spaceId: `garden_plot_${color}_${i == 0 ? 'stone' : 'plant'}`,
                    width: plotWidth,
                    height: plotHeight,
                    color: i == 0 ? 0xbd7575 : 0x9ecc90,
                    gfx: this.createGardenPlotGfx(plots[i].actions, plotWidth, plotHeight),
                    colorMap: this.color_map
                });
                
                this.add(gardenPlot);
                this.garden_plots.push(gardenPlot);
                
                xPos += plotWidth;
            }
            
            yPos += plotHeight + bridgeHeight;
        }
    }
    
    //TODO TEMP display before adding gfx
    createGardenPlotGfx(actions, plotW, plotH) {
        const gfx = new Phaser.GameObjects.Container(this.scene, 0, 0);
        gfx.y = (plotH - 14) / 2;
        
        let yPos = 0;
        for(const action of actions) {
            let txt = '';
            
            if(action.type == 'action') {
                txt = action.name;
            } else {
                txt = JSON.stringify(action.resources);
            }
            
            let actionTxt = new Phaser.GameObjects.Text(this.scene, 0, yPos, txt, {
                fontSize: '12px',
                fontStyle: 'bold',
                color: '#000'
            });
            actionTxt.setWordWrapWidth(plotW);
            actionTxt.setStroke('#fff', 4);
            actionTxt.setOrigin(0);
            
            gfx.add(actionTxt);
            
            yPos += 16;
        }
        
        return gfx;
    }
}