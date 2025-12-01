

export class RivalResourceBoard extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, spacing, player} = config;
        super(scene, x, y);
        this.player = player
        this.scene.add.existing(this);  
        this.resources = {};
        //adding rectangle background 

        this.playerUsername = new Phaser.GameObjects.Container(this.scene, -10, -30);
        const playerId = new Phaser.GameObjects.Text(this.scene, 15, 15, this.player.id, {
            fontSize: '20px',
            fontStyle: 'bold',
            color: this.player.color
        });
        playerId.setStroke("#000", 2);
        playerId.setOrigin(0);
        this.playerUsername.add(playerId);
        this.rivalResourceBoard = new Phaser.GameObjects.Container(this.scene, 0, 100 + spacing);
        const resourceBackground = new Phaser.GameObjects.Rectangle(scene, 0, 0, 300, 50, 0x9a9ed4);
        resourceBackground.setOrigin(0);
        this.rivalResourceBoard.add(resourceBackground);
        this.rivalResourceBoard.add(this.playerUsername);
        this.add(this.rivalResourceBoard);

        //Handle Player Icons 
        this.setPlayerResourceIcons();
        //Handle Other Players resource Icons

        // Set domain board
    }


    setPlayerResourceIcons(){
        const iconNames = ["food", "iron", "pearl", "daimyo", "coin"];
        const resourceBoard = new Phaser.GameObjects.Container(this.scene, 0, 0); 
        
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
        this.rivalResourceBoard.add(resourceBoard);
        // this.resources.pearl.text = "2/7";
    }
}