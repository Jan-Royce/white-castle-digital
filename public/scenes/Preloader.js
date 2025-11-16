export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    
    preload() {
        this.load.setPath('assets');
        
        this.load.image('start_red', 'start_red.png');
        this.load.image('start_red_pressed', 'start_red_pressed.png');
        
        this.load.image('dice1', 'dice1.png');
        this.load.image('dice2', 'dice2.png');
        this.load.image('dice3', 'dice3.png');
        this.load.image('dice4', 'dice4.png');
        this.load.image('dice5', 'dice5.png');
        this.load.image('dice6', 'dice6.png');
    }
    
    create() {
        this.scene.start('Game');
    }
}