import { Boot } from './scenes/Boot.js';
import { Game } from './scenes/Game.js';
import { GameOver } from './scenes/GameOver.js';
import { Preloader } from './scenes/Preloader.js';

const config = {
    type: Phaser.AUTO,
    title: 'The White Castle',
    description: '',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#90e0bf',
    pixelArt: false,
    scene: [
        Boot,
        Preloader,
        Game,
        GameOver
    ],
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
            