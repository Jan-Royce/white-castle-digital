export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }
    
    preload() {
        // TODO/NOTE maybe use spritesheet / atlas instead if it's more efficient
        this.load.setPath('assets');
        
        this.load.image('start_red', 'start_red.png');
        this.load.image('start_red_pressed', 'start_red_pressed.png');
        
        this.load.image('ui_resource_selector', 'ui/gfx_resource_selector.png');
        
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
        this.load.image('icon_select_resource', 'icons/select_resource.png');
        
        this.load.image('icon_influence', 'icons/influence.png');
        this.load.image('icon_clan_point', 'icons/clan_point.png');
        this.load.image('icon_clan_point_end_game', 'icons/clan_point_end_game.png');
        
        this.load.image('icon_well', 'icons/well.png');
        this.load.image('icon_lantern', 'icons/lantern.png');
        this.load.image('icon_castle', 'icons/castle.png');
        this.load.image('icon_yard', 'icons/yard.png');
        this.load.image('icon_garden', 'icons/garden.png');
        this.load.image('icon_castle_or_yard_or_garden', 'icons/castle_or_yard_or_garden.png');
        
        this.load.image('icon_white_scroll', 'icons/white_scroll.png');
        this.load.image('icon_black_scroll', 'icons/black_scroll.png');
        this.load.image('icon_black_die_tile', 'icons/black_die_tile.png');
        this.load.image('icon_red_die_tile', 'icons/red_die_tile.png');
        this.load.image('icon_white_die_tile', 'icons/white_die_tile.png');
        this.load.image('icon_wild_die_tile', 'icons/wild_die_tile.png');
        this.load.image('icon_domain_select', 'icons/domain_select.png');
        
        this.load.image('tile_black', 'tiles/black.png');
        this.load.image('tile_red', 'tiles/red.png');
        this.load.image('tile_white', 'tiles/white.png');
        this.load.image('tile_food', 'tiles/food.png');
        this.load.image('tile_iron', 'tiles/iron.png');
        this.load.image('tile_pearl', 'tiles/pearl.png');
        this.load.image('tile_select_resource', 'tiles/select_resource.png');
        this.load.image('tile_coin', 'tiles/coin.png');
        this.load.image('tile_daimyo', 'tiles/daimyo.png');
        this.load.image('tile_influence', 'tiles/influence.png');
        this.load.image('tile_clan_point', 'tiles/clan_point.png');
        
        this.load.image('unit_courtier', 'units/courtier.png');
        this.load.image('unit_gardener', 'units/gardener.png');
        this.load.image('unit_warrior', 'units/warrior.png');
        this.load.image('unit_geysha', 'units/geysha.png');
        
        this.load.image('gfx_well', 'static/gfx_well.png');
        this.load.image('gfx_outside_wall', 'static/gfx_outside_wall.png');
        this.load.image('gfx_gate', 'static/gfx_gate.png');
        this.load.image('gfx_castle_top', 'static/gfx_castle_top.png');
        this.load.image('gfx_castle_bonus', 'static/gfx_castle_bonus.png');
        
        this.load.image('score_castle_1', 'static/score_castle_1.png');
        this.load.image('score_castle_3', 'static/score_castle_3.png');
        this.load.image('score_castle_6', 'static/score_castle_6.png');
        this.load.image('score_castle_10', 'static/score_castle_10.png');
        
        this.load.image('castle_lvl1_01', 'cards/lvl1_01.png');
        this.load.image('castle_lvl1_02', 'cards/lvl1_02.png');
        this.load.image('castle_lvl1_03', 'cards/lvl1_03.png');
        this.load.image('castle_lvl1_04', 'cards/lvl1_04.png');
        this.load.image('castle_lvl1_05', 'cards/lvl1_05.png');
        this.load.image('castle_lvl1_06', 'cards/lvl1_06.png');
        this.load.image('castle_lvl1_07', 'cards/lvl1_07.png');
        this.load.image('castle_lvl1_08', 'cards/lvl1_08.png');
        this.load.image('castle_lvl1_09', 'cards/lvl1_09.png');
        this.load.image('castle_lvl1_10', 'cards/lvl1_10.png');
        this.load.image('castle_lvl1_11', 'cards/lvl1_11.png');
        this.load.image('castle_lvl1_12', 'cards/lvl1_12.png');
        this.load.image('castle_lvl1_13', 'cards/lvl1_13.png');
        this.load.image('castle_lvl1_14', 'cards/lvl1_14.png');
        this.load.image('castle_lvl1_15', 'cards/lvl1_15.png');
        
        this.load.image('castle_lvl2_01', 'cards/lvl2_01.png');
        this.load.image('castle_lvl2_02', 'cards/lvl2_02.png');
        this.load.image('castle_lvl2_03', 'cards/lvl2_03.png');
        this.load.image('castle_lvl2_04', 'cards/lvl2_04.png');
        this.load.image('castle_lvl2_05', 'cards/lvl2_05.png');
        this.load.image('castle_lvl2_06', 'cards/lvl2_06.png');
        this.load.image('castle_lvl2_07', 'cards/lvl2_07.png');
        this.load.image('castle_lvl2_08', 'cards/lvl2_08.png');
        this.load.image('castle_lvl2_09', 'cards/lvl2_09.png');
        this.load.image('castle_lvl2_10', 'cards/lvl2_10.png');
        this.load.image('castle_lvl2_11', 'cards/lvl2_11.png');
        this.load.image('castle_lvl2_12', 'cards/lvl2_12.png');
        
        this.load.image('score_yard_1', 'static/score_yard_1.png');
        this.load.image('score_yard_2', 'static/score_yard_2.png');
        this.load.image('cost_yard_1', 'static/cost_yard_1.png');
        this.load.image('cost_yard_3', 'static/cost_yard_3.png');
        this.load.image('cost_yard_5', 'static/cost_yard_5.png');
        
        this.load.image('stone_coin_3', 'cards/stone_garden_coin_3.png');
        this.load.image('stone_daimyo_2', 'cards/stone_garden_daimyo_2.png');
        this.load.image('stone_select_resource_2', 'cards/stone_garden_select_resource_2.png');
        this.load.image('stone_lantern', 'cards/stone_garden_lantern.png');
        this.load.image('stone_well', 'cards/stone_garden_well.png');
        this.load.image('stone_white_scroll', 'cards/stone_garden_white_scroll.png');
        this.load.image('plant_castle', 'cards/plant_castle_action.png');
        this.load.image('plant_castle_or_yard_or_garden', 'cards/plant_castle_or_yard_or_garden_action.png');
        this.load.image('plant_domain_select', 'cards/plant_domain_select_action.png');
        this.load.image('plant_garden', 'cards/plant_garden_action.png');
        this.load.image('plant_wild_die_tile', 'cards/plant_wild_die_tile_action.png');
        this.load.image('plant_yard', 'cards/plant_yard_action.png');
        
        this.load.image('score_garden_1', 'static/score_garden_1.png');
        this.load.image('score_garden_3', 'static/score_garden_3.png');
        this.load.image('score_garden_5', 'static/score_garden_5.png');
        this.load.image('score_garden_7', 'static/score_garden_7.png');
        this.load.image('score_garden_9', 'static/score_garden_9.png');
    }
    
    create() {
        this.scene.start('Game');
    }
}