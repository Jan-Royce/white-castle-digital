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
        
        this.load.image('icon_food', 'icons/food.png');
        this.load.image('icon_iron', 'icons/iron.png');
        this.load.image('icon_pearl', 'icons/pearl.png');
        this.load.image('icon_coin', 'icons/coin.png');
        this.load.image('icon_daimyo', 'icons/daimyo.png');
        this.load.image('icon_influence', 'icons/influence.png');
        this.load.image('icon_clan_point', 'icons/clan_point.png');
        this.load.image('icon_clan_point_end_game', 'icons/clan_point_end_game.png');
        
        this.load.image('tile_black', 'tiles/black.png');
        this.load.image('tile_red', 'tiles/red.png');
        this.load.image('tile_white', 'tiles/white.png');
        this.load.image('tile_food', 'tiles/food.png');
        this.load.image('tile_iron', 'tiles/iron.png');
        this.load.image('tile_pearl', 'tiles/pearl.png');
        this.load.image('tile_iron_or_food_or_pearl_1', 'tiles/iron_or_food_or_pearl_1.png');
        this.load.image('tile_coin', 'tiles/coin.png');
        this.load.image('tile_daimyo', 'tiles/daimyo.png');
        this.load.image('tile_influence', 'tiles/influence.png');
        this.load.image('tile_clan_point', 'tiles/clan_point.png');
        
        this.load.image('unit_courtier', 'units/courtier.png');
        this.load.image('unit_gardener', 'units/gardener.png');
        this.load.image('unit_warrior', 'units/warrior.png');
        this.load.image('unit_geysha', 'units/geysha.png');
        
        this.load.image('gfx_well', 'static/gfx_well.png');
        this.load.image('gfx_gate', 'static/gfx_gate.png');
        this.load.image('gfx_daimyo_convert_coin', 'static/gfx_daimyo_convert_coin.png');
        this.load.image('gfx_daimyo_convert_resource', 'static/gfx_daimyo_convert_resource.png');
        this.load.image('gfx_lantern', 'static/gfx_lantern.png');
        
        this.load.image('score_castle_1', 'static/score_castle_1.png');
        this.load.image('score_castle_3', 'static/score_castle_3.png');
        this.load.image('score_castle_6', 'static/score_castle_6.png');
        this.load.image('score_castle_10', 'static/score_castle_10.png');

    }
    
    create() {
        this.scene.start('Game');
    }
}