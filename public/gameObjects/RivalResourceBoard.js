

export class RivalResourceBoard extends Phaser.GameObjects.Container{
    constructor(config) {
        const { scene, x, y, player } = config;
        
        super(scene, x, y);
        
        this.player = player;

        this.resources_amount = {};
        
        this.displayPlayerId();
        this.setPlayerResourceIcons();
    }
    
    updatePlayerResource() {
        this.resources_amount.food.text = `${this.player.food}`;
        this.resources_amount.iron.text = `${this.player.iron}`;
        this.resources_amount.pearl.text = `${this.player.pearl}`;
        this.resources_amount.daimyo.text = `${this.player.daimyo}`;
        this.resources_amount.coin.text = `${this.player.coin}`;
    }
    
    displayPlayerId() {
        const playerId = new Phaser.GameObjects.Text(this.scene, 5, -20, this.player.id, {
            fontSize: '15px',
            fontStyle: 'bold',
            color: this.player.color
        });
        playerId.setStroke("#000", 2);
        playerId.setOrigin(0);
        this.add(playerId);
    }
    //display lantern trigger
    setPlayerResourceIcons() {
        const iconNames = ["food", "iron", "pearl", "daimyo", "coin"];
        const resourceBoard = new Phaser.GameObjects.Container(this.scene, 5, 0); 
        const resourceBackground = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 160, 30, this.player.int_color).setOrigin(0);
        let iconGap = 0;
        iconNames.forEach( icon => {
            const resourceContainer = new Phaser.GameObjects.Container(this.scene, iconGap, 0);
            this.setResourceIcon({
                container: resourceContainer, 
                iconName: icon,
                width: 25, 
                height: 25, 
                x: 0, 
                y: 0
            });
            this.setText({
                container: resourceContainer, 
                iconName: icon, 
                x:10, 
                y:10
            });
            resourceBoard.add(resourceContainer)
            iconGap+=30;
        });
        this.add(resourceBackground);
        this.add(resourceBoard);
    }

    setText(config) {
        const {container, iconName, x, y} = config;
        let setText = `0`;
        const resourceText = new Phaser.GameObjects.Text(this.scene, x, y, setText, {
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#000'
        }).setStroke("#ffffff", 2);
        this.resources_amount[iconName] = resourceText;
        resourceText.setOrigin(0);
        container.add(resourceText);
    }

    setResourceIcon(config) {
        const {container, iconName, width, height, x, y} = config;
        const icon = new Phaser.GameObjects.Sprite(this.scene, x, y, `icon_${iconName}`);
        icon.setDisplaySize(width, height);
        icon.setOrigin(0);
        container.add(icon);
    }
}