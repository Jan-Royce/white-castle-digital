export class DieSpace extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, board, size, value, color, maxCount, alwaysShow, actions } = config;
        const texture = `dice${value}`;
        
        super(scene, x, y);
        
        this.init_value = value;
        this.value = value;
        this.color = color ?? 'gray';
        this.max_count = maxCount;
        this.board = board;
        this.actions = actions;
        this.always_show = alwaysShow;
        /**
         * dice example
         * 
         * {
         *   color: 'red'
         *   value: 4
         * }
         */
        this.dice = [];
        this.color_restrictions = [];
        this.can_place = false;
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, size, size, 0xff501a);
        bg.setOrigin(0);
        bg.setAlpha(0);
        this.bg = bg;
        this.add(bg);
        
        const die = new Phaser.GameObjects.Sprite(this.scene, 0, 0, texture);
        this.die = die;
        this.add(die);
        
        if(maxCount == Number.POSITIVE_INFINITY || this.dice.length == 0) die.setAlpha(0.55);
        
        die.setDisplaySize(size, size);
        die.setOrigin(0);
        die.tint = this.getColor(this.color);
        die.setInteractive({ useHandCursor: true });
        
        die.on('pointerup', () => {
            if(!this.board.selected_die) return;
            if(!this.can_place) return;
            
            const selected = this.board.selected_die;
            
            if(selected.value != this.value) {
                this.scene.events.emit('gain_resources', {
                    type: 'resource',
                    resources: {
                        coin: selected.value - this.value
                    }
                });
            }
            
            const placeIndex = this.board.die_spaces.indexOf(this);
            const dieData = {
                color: selected.color,
                value: selected.value
            };
            this.placeDie(dieData);
            this.scene.events.emit('place_die', { die: dieData, index: placeIndex, space_id: this.space_id });
            
            const bridge = selected.bridge;
            const removeAt = bridge.dice.indexOf(selected);
            let lanternTrigger = removeAt == 0;
            if (bridge.dice.length == 1) lanternTrigger = bridge.dice_data.indexOf(selected.value) == 0;

            bridge.removeDie(removeAt, selected);
            this.scene.events.emit('remove_die', { color: selected.color, index: removeAt });
            
            if(lanternTrigger) {
                this.scene.events.emit('trigger_lantern');
            }
            
            let actions = [];
            if(this.color_restrictions.length == 0) {
                actions = this.actions;
            } else {
                actions = this.actions[selected.color];
            }
            this.scene.events.emit('add_actions', actions);
        });
    }
    
    getColor(colorString) {
        const colors = {
            "red": 0xd47878,
            "black": 0x6e706b,
            "white": 0xfcf9f9,
            "green": 0xb7dda2,
            "gray": 0xbbbbbb
        };
        
        return colors[colorString];
    }
    
    addHighlight() {
        this.bg.setAlpha(1);
        this.can_place = true;
    }
    
    removeHighlight() {
        this.bg.setAlpha(0);
        this.can_place = false;
    }
    
    placeDie(die) {
        this.dice.push(die);
        
        if(!this.always_show) {
            this.color = die.color;
            this.value = die.value;
            this.die.setTexture(`dice${this.value}`);
            this.die.tint = this.getColor(this.color);
            this.die.setAlpha(1);
        } else {
            this.board_space.updateDieDisplay();
        }
        
        this.board.clearDieSpaceHighlights();
        this.board.clearDiceHighlights();
    }
}