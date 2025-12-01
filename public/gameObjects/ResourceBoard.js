

export class ResourceBoard extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y} = config;
        super(scene, x, y);
        this.scene.add.existing(this);
        this.resources = {};
        // const width = this.scene.scale.width;
        const height = this.scene.scale.height;
        //UI 
        this.playerResourceBoard = new Phaser.GameObjects.Container(this.scene, 0, height);
        const resourceBackground = new Phaser.GameObjects.Rectangle(scene, 0, (this.height - 50), 300, 50, 0x9a9ed4);
        resourceBackground.setOrigin(0);
        this.playerResourceBoard.add(resourceBackground);
        // Fields
        this.lanternIconGap = 0;
        
        //Handle Player Icons 
        this.setPlayerResourceIcons();
        this.setPlayerConvertionIcon();
        this.setPlayerLanternIcon();
        this.add(this.playerResourceBoard);
    }
    
    // fix this so the board accept multiple card
    addPlayerLanternTrigger(icon){
        const lanternResourceContainer = new Phaser.GameObjects.Container(this.scene, 60,  this.height - 82);
        const lanterResourceIcon = new Phaser.GameObjects.Sprite(this.scene, this.lanternIconGap, 0, `icon_${icon}`);
        lanterResourceIcon.setDisplaySize(30, 30);
        lanterResourceIcon.setOrigin(0);
        lanternResourceContainer.add(lanterResourceIcon);
        this.playerResourceBoard.add(lanternResourceContainer)
        this.lanternIconGap += 20;
    }

    setPlayerConvertionIcon(){
        const convertionContainer = new Phaser.GameObjects.Container(this.scene, 0, this.height - 120);
        const coinConvertIcon = new Phaser.GameObjects.Sprite(this.scene, 80, 0, `gfx_daimyo_convert_coin`);
        const resouceConvertIcon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `gfx_daimyo_convert_resource`);
        
        coinConvertIcon.setDisplaySize(85, 35);
        coinConvertIcon.setOrigin(0);
        resouceConvertIcon.setDisplaySize(85, 35);
        resouceConvertIcon.setOrigin(0);
        convertionContainer.add(coinConvertIcon);
        convertionContainer.add(resouceConvertIcon);
        this.playerResourceBoard.add(convertionContainer);
    }
    
    setPlayerLanternIcon(){
        const lanternIconContainer = new Phaser.GameObjects.Container(this.scene, 0, this.height - 80);
        const lanternIcon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `gfx_lantern`);
        lanternIcon.setDisplaySize(45, 30);
        lanternIcon.setOrigin(0);
        lanternIconContainer.add(lanternIcon);
        this.playerResourceBoard.add(lanternIconContainer);

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
        this.playerResourceBoard.add(resourceBoard);
        // this.resources.pearl.text = "2/7";
    }
}