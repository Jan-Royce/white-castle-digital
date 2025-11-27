
import { ResourceIcon } from './ResourceIcon.js';

export class PlayerResourceBoard extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, playerData } = config;
        super(scene, x, y);
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, 100, 390, 0x9a9ed4);
        this.add(background)
        background.setOrigin(0);
        this.scene.add.existing(this);

        this.resourceBoard;

        //Handle Icons 
        this.resourceIcon = [];
        this.setResourceIcons();
        console.log(this.resourceIcon)

        //Create 
    }
    
    showResourceAmount(){
        
    }
    
    setResourceIcons(){
        let icons = ["clan_point", "coin", "daimyo", "food", "iron", "pearl"];
        let gap = 20;
        icons.forEach( icon => {
            let temp = new ResourceIcon({
                scene: this.scene,
                x: gap,
                y: 310,
                iconSize: 50,
                imageName: icon,
            });
            this.resourceIcon.push(temp)
            this.add(temp);
            gap+=60;
        });
    }
    displayPlayerData(){

    }
}