
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
        
        this.createResourceGfx();
        this.createBoardGfx();
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

    addLanternReward(icon) {
        const lanterResourceIcon = new Phaser.GameObjects.Sprite(this.scene, this.lantern_icon_gap, 0, `icon_${icon}`).setDisplaySize(30,30).setOrigin(0);
        this.lantern_display.add(lanterResourceIcon);
        this.lantern_icon_gap += 20;
    }
    
    createBoardGfx() {
        const convertSprites = ['gfx_daimyo_convert_coin', 'gfx_daimyo_convert_resource'];
        const conversionContainer = new Phaser.GameObjects.Container(this.scene, 0, 0);
        const sprWidth = 85;
        const sprHeight = 35;
        
        conversionContainer.y = -18;
        
        // TODO change to buttons
        let xPos = 0;
        for(const spr of convertSprites) {
            const sprite = new Phaser.GameObjects.Sprite(this.scene, xPos, 0, spr);
            sprite.setDisplaySize(sprWidth, sprHeight);
            sprite.setOrigin(0);
            conversionContainer.add(sprite);
            
            xPos += sprWidth;
        }
        this.add(conversionContainer);
        
        const lanternYpos = 20;
        
        const lanternIcon = new Phaser.GameObjects.Sprite(this.scene, 0, lanternYpos, 'gfx_lantern');
        lanternIcon.setScale(0.36);
        lanternIcon.setOrigin(0);
        this.add(lanternIcon);
        
        const lanternXpos = lanternIcon.displayWidth;
        const lanternContainer = new Phaser.GameObjects.Container(this.scene, lanternXpos, lanternYpos);
        this.add(lanternContainer);
        this.lantern_display = lanternContainer;
    }

    createResourceGfx() {
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