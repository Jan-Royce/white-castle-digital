
export class DomainBoard extends Phaser.GameObjects.Container{
    constructor(config){
        const { scene, x, y, player } = config;
        super(scene, x, y);

        this.player = player;
        const screen_width = this.scene.scale.height;
        const screen_height = this.scene.scale.height;
        const width = 500;
        const height = 500;

        // this.board_zone = new Phaser.GameObjects.Zone(scene, x, y, screen_width, screen_height).setOrigin(0).setInteractive();
        // this.board_zone.on('pointerup', () => {
        //     console.log("click out side")
        // });
        // this.add(this.board_zone);

        // const background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, width, height, 0xFF0000).setOrigin(0);

        // const button = new Phaser.GameObjects.Rectangle(this.scene, 500 - 150, 20, 150, 50, 0x0A9ED9).setOrigin(0).setInteractive().on('pointerup', () =>{
        //     console.log("button");
        // });

        // this.playerDomainBoard.add(background);
        // this.playerDomainBoard.add(button);
        // this.add(this.playerDomainBoard);

        // background.setInteractive()
    }

    checkBoardState(){
        this.playerDomainBoard.isOpen = !this.playerDomainBoard.isOpen;
        if(this.playerDomainBoard.isOpen){
            this.board_zone.disableInteractive();

        }else{
            this.board_zone.setInteractive();
        }
    }
}