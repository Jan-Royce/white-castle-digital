

export class ResourceBoard extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y} = config;
        super(scene, x, y);
        this.scene.add.existing(this);
        this.resources = {};
        this.height = y;
        //adding rectangle background 
        const resourceBackground = new Phaser.GameObjects.Rectangle(scene, 0, (this.height - 50), 300, 50, 0x9a9ed4);
        resourceBackground.setOrigin(0);
        this.add(resourceBackground);
        this.lanternIconGap = 0;

        //Handle Player Icons 
        this.setPlayerResourceIcons();
        //Handle Other Players resource Icon

        // Set domain board
    }
    
    
    addPlayerLanternTrigger(icon){
        const lanternResourceContainer = new Phaser.GameObjects.Container(this.scene, 40,  this.height - 90);
        const lanterResourceIcon = new Phaser.GameObjects.Sprite(this.scene, this.lanternIconGap, 0, `icon_${"icon"}`);
        lanterResourceIcon.setDisplaySize(40, 40);
        lanterResourceIcon.setOrigin(0);
        lanternResourceContainer.add(lanterResourceIcon);
        this.add(lanternResourceContainer)
        this.lanternIconGap += 20;
        console.log(this.lanternIconGap)
    }

    setPlayerResourceIcons(){
        const iconNames = ["food", "iron", "pearl", "daimyo", "coin"];
        const resourceBoard = new Phaser.GameObjects.Container(this.scene, 0, this.height - 45); 
        let iconGap = 0;
        iconNames.forEach( icon => {
            const resourceContainer = new Phaser.GameObjects.Container(this.scene, iconGap, 0);
            const resourceIcon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `icon_${icon}`);
            resourceIcon.setDisplaySize(40, 40);
            resourceIcon.setOrigin(0);
            if(icon != "coin"){
                const resourceLimit = new Phaser.GameObjects.Text(this.scene, 20, 20, (icon != "daimyo") ? "0/7":"0/5" , {
                    fontSize: '20px',
                    fontStyle: 'bold',
                    color: '#000'
                });
                resourceLimit.setStroke("#ffffff", 2);
                this.resources[icon] = resourceLimit;
                resourceLimit.setOrigin(0);
                resourceContainer.add(resourceIcon);
                resourceContainer.add(resourceLimit);
            }
            else{
                const coin = new Phaser.GameObjects.Text(this.scene, 20, 20, "0", {
                    fontSize: '20px',
                    fontStyle: 'bold',
                    color: '#000'
                });
                coin.setStroke("#ffffff", 2);
                this.resources[icon] = coin;
                coin.setOrigin(0);
                resourceContainer.add(resourceIcon);
                resourceContainer.add(coin);
            }
            resourceBoard.add(resourceContainer);
            iconGap+=60;
        });
        this.add(resourceBoard);
        // this.resources.pearl.text = "2/7";
    }
}