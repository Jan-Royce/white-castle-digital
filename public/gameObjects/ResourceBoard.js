
export class ResourceBoard extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, player } = config;
        super(scene, x, y);
        this.player = player;
        
        this.resources_amount = {};
        
        this.food = 0;
        this.iron = 0;
        this.pearl = 0;
        this.daimyo = 0;
        this.coin = 0;

        this.board_width = 300;
        this.board_height = 100;
        const height = this.scene.scale.height;

        this.lantern_icon_gap = 0;
        this.y = height - this.board_height;
        
        this.displayPlayerResourceIcons();
        this.displayGfxIcon();
    }
    
    updatePlayerResource() {
        const resources = ['food', 'iron', 'pearl', 'daimyo', 'coin'];
        const limits = {
            food: 7,
            iron: 7,
            pearl: 7,
            daimyo: 5,
            coin: null
        };
        
        for(const resource of resources) {
            const limitText = limits[resource] ? `/${limits[resource]}` : ``;
            this.scene.tweens.add({
                targets: { val: this[resource] },
                val: this.player[resource],
                duration: 300,
                ease: 'Linear',
                onUpdate: (tween) => {
                    this.resources_amount[resource].text = `${Math.floor(tween.getValue())}${limitText}`;
                },
                onComplete: () => {
                    this[resource] = this.player[resource];
                }
            });
        }
    }

    addLanternTrigger(icon) { // TODO: function to change this 
        const lanternResourceContainer = new Phaser.GameObjects.Container(this.scene, 50,  (this.board_height / 2) - 30);
        const lanterResourceIcon = new Phaser.GameObjects.Sprite(this.scene, this.lantern_icon_gap, 0, `icon_${icon}`).setDisplaySize(30,30).setOrigin(0);
        lanternResourceContainer.add(lanterResourceIcon);
        this.add(lanternResourceContainer)
        this.lantern_icon_gap += 20;
    }

    displayGfxIcon() {
        const gfxIconNames = ["daimyo_convert_coin", "daimyo_convert_resource", "lantern"]
        const conversionContainer = new Phaser.GameObjects.Container(this.scene, 0, 0);
        let width = 85, height = 35;
        gfxIconNames.forEach( icon =>{
            const gfxIcon = new Phaser.GameObjects.Sprite(this.scene, 
                (icon != "lantern" && icon == "daimyo_convert_coin") ? width + 5: 0, 
                (icon == "lantern") ? (this.height/2) + 20: (this.height/2) - 20, `gfx_${icon}`);
            if(icon === "lantern"){width = 45, height = 30;}
            gfxIcon.setDisplaySize(width, height);
            gfxIcon.setOrigin(0);
            conversionContainer.add(gfxIcon)
        });
        this.add(conversionContainer);
    }

    displayPlayerResourceIcons() {
        const resourceIconNames = ["food", "iron", "pearl", "daimyo", "coin"];
        const resourceBoard = new Phaser.GameObjects.Container(this.scene, 10, this.board_height / 2); 
        const resourceBackground = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, this.board_width, this.board_height, this.player.int_color).setOrigin(0);
        let iconGap = 0;
        resourceIconNames.forEach( icon => {
            const resourceContainer = new Phaser.GameObjects.Container(this.scene, iconGap, 0);
            this.setResourceIcon({
                container: resourceContainer, 
                iconName: icon,
                width: 40, 
                height: 40, 
                x: 0, 
                y: 0
            });
            this.setText({
                container: resourceContainer, 
                iconName: icon, 
                x:20, 
                y:20
            });
            resourceBoard.add(resourceContainer)
            iconGap+=60;
        });
        this.add(resourceBackground);
        this.add(resourceBoard);
    }

    setText(config) {
        const {container, iconName, x, y} = config;
        let setText = `0`;
        if(iconName != "coin") setText = (iconName != "daimyo") ? `0/7`: `0/5`;
        const resourceText = new Phaser.GameObjects.Text(this.scene, x, y, setText, {
            fontSize: '20px',
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