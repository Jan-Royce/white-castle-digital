export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    
    preload() {
        
    }
    
    create() {
        this.scene.start('Game');
    }
}