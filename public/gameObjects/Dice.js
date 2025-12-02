export class Dice extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, board, bridge, size, value, color } = config;
        const texture = `dice${value}`;
        
        super(scene, x, y);
        
        const colors = {
            "red": 0xd47878,
            "black": 0x6e706b,
            "white": 0xfcf9f9,
            "green": 0xb7dda2
        };
        
        this.board = board;
        this.bridge = bridge;
        this.value = value;
        this.color = color;
        this.can_take = false;
        
        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, size, size, 0x1acaff);
        bg.setOrigin(0);
        bg.setAlpha(0);
        this.bg = bg;
        this.add(bg);
        
        const die = new Phaser.GameObjects.Sprite(this.scene, 0, 0, texture);
        this.die = die;
        this.add(die);
        
        die.setDisplaySize(size, size);
        die.setOrigin(0);
        die.tint = colors[color];
        die.setInteractive({ useHandCursor: true });
        
        die.on('pointerup', () => {
            if(!this.can_take) return;
            
            this.board.clearDieSpaceHighlights();
            this.board.clearDiceHighlights();
            
            this.addHighlight();
            this.board.selected_die = this;
            
            let spaces = this.board.die_spaces.filter(space => {
                //TODO add the current coin check here to see which spaces can be paid for
                return (space.color_restrictions.length == 0 || space.color_restrictions.includes(this.color))
                    && space.dice.length < space.max_count;
            });
            
            for(const space of spaces) {
                space.addHighlight();
            }
        });
    }
    
    addHighlight() {
        this.bg.setAlpha(1);
    }

    removeHighlight() {
        this.bg.setAlpha(0);
    }
}