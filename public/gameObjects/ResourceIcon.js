export class ResourceIcon extends Phaser.GameObjects.Sprite{
    constructor(config){
        const { scene, x, y, iconSize, imageName, quantity} = config;
        const texture = `icon_${imageName}`;
        // console.log(this.textures.exists(texture))

        super(scene, x, y, texture);
        this.texture = `${texture}`;
        
        this.setDisplaySize(iconSize, iconSize);
        this.setOrigin(0);
        
    }
}