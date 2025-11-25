import { Bridge } from './Bridge.js';
import { Castle } from './Castle.js';

export class Board extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, boardData } = config;
        
        super(scene, x, y);
        
        this.color_map = boardData.color_map;
        this.bridges = {};
        
        const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        this.height = height * 0.85;
        
        this.x = width * 0.15;
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, width * 0.85, this.height, 0x9a9ed4);
        background.setOrigin(0);
        this.add(background);
        
        this.scene.add.existing(this);
        
        this.createBridges(boardData.bridges);
        this.setUpCastle(boardData.castle);
    }
    
    createBridges(bridgeData) {
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
}