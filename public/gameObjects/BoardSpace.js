import { DieSpace } from './DieSpace.js';

export class BoardSpace extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, spaceId, floorId, roomId, width, height, color, noBackground, dieSpace, scoreGfx, gfx, units, unitType, unitPos, unitSize, unitCount, colorMap } = config;
        
        super(scene, x, y);
        
        this.space_id = spaceId;
        if(typeof(floorId) !== 'undefined') this.floor_id = floorId;
        if(typeof(roomId) !== 'undefined') this.room_id = roomId;
        this.width = width ?? 200;
        this.height = height ?? 200;
        this.color = color ?? 0x868686;
        this.color_map = colorMap;
        
        const background = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.width, this.height, this.color);
        background.setOrigin(0);
        if(typeof (noBackground) !== 'undefined' && noBackground) background.setAlpha(0);
        this.add(background);
        
        background.setInteractive({ useHandCursor: true });
        
        background.on('pointerup', () => {
            console.log(this.space_id)
        });
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, this.width, this.height);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);
        this.zone = zone;
        
        if(typeof(dieSpace) !== 'undefined') {
            if(dieSpace.always_show) {
                const dieDisplay = new Phaser.GameObjects.Container(this.scene, 0, 0);
                
                this.add(dieDisplay);
                this.die_display = dieDisplay;
            }
            
            let dieSpaceX = dieSpace.x ?? 10;
            let dieSpaceY = dieSpace.y ?? this.height / 4;
            
            const space = new DieSpace({
                scene: this.scene,
                x: dieSpaceX,
                y: dieSpaceY,
                size: dieSpace.die_size,
                value: dieSpace.die_value,
                maxCount: dieSpace.max_die_count,
                alwaysShow: dieSpace.always_show,
                board: dieSpace.board,
                actions: dieSpace.actions
            });
            this.add(space);
            this.die_space = space;
            this.die_space_dice = [];
        }
        
        if(typeof(gfx) !== 'undefined') {
            this.add(gfx);
            this.gfx = gfx;
        }
        
        if(typeof(scoreGfx) !== 'undefined') {
            this.add(scoreGfx);
            this.score_gfx = scoreGfx;
        }
        
        if(typeof (unitType) !== 'undefined') {
            this.units = units ?? {};
            this.unit_type = unitType;
            this.unit_size = unitSize ?? 40;
            this.unit_count_show = typeof (unitCount) === 'undefined' || unitCount;
            this.unit_pos = unitPos;
            
            this.createUnitSpace();
        }
    }
    
    createUnitSpace() {
        const unitSpace = new Phaser.GameObjects.Container(this.scene, 0, 0);
        if (this.unit_pos) {
            if (typeof (this.unit_pos.x) !== 'undefined') unitSpace.x = this.unit_pos.x;
            if (typeof (this.unit_pos.y) !== 'undefined') unitSpace.y = this.unit_pos.y;
            if (typeof (this.unit_pos.wrap_per) !== 'undefined') {
                this.unit_space_wrap = true;
                this.unit_space_wrap_per = this.unit_pos.wrap_per;
            }
        } else {
            this.unit_space_wrap = false;
            unitSpace.x = this.width / 4;
        }

        this.add(unitSpace);
        this.unit_space = unitSpace;
    }
    
    updateDieDisplay()
    {
        let dieSpace = this.die_space;
        
        this.clearDieDisplay();
        
        if(dieSpace.dice.length > 0 && dieSpace.max_count == Number.POSITIVE_INFINITY) {
            const dieDisplay = this.die_display;
            
            let xPos = 0;
            for(let die of dieSpace.dice) {
                const dieIcon = new Phaser.GameObjects.Sprite(this.scene, xPos, -12, `dice${die.value}`);
                
                dieIcon.setDisplaySize(24,24);
                dieIcon.setOrigin(0);
                dieIcon.setTint(dieSpace.getColor(die.color));
                dieDisplay.add(dieIcon);
                
                this.die_space_dice.push(dieIcon);
                
                xPos += 24;
            }
        }
    }
    
    clearDieDisplay() {
        for(const die of this.die_space_dice) {
            die.destroy(true);
        }
    }
    
    updateUnitDisplay() {
        const unitSpace = this.unit_space;
        
        let xPos = 0;
        let yPos = 50;
        let wrapCount = 0;
        
        for(const [key, count] of Object.entries(this.units)) {
            if(count == 0) continue;
            
            const unit = new Phaser.GameObjects.Container(this.scene, xPos, yPos);
            
            const unitIcon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, `unit_${this.unit_type}`);
            unitIcon.setDisplaySize(this.unit_size, this.unit_size);
            unitIcon.setTint(this.color_map[key]);
            unitIcon.setOrigin(0);
            unit.add(unitIcon);
            
            if (this.unit_count_show) {
                const unitCount = new Phaser.GameObjects.Text(this.scene, this.unit_size/4+2, this.unit_size/4, count, {
                    fontSize: `${this.unit_size / 2}px`,
                    fontStyle: 'bold',
                    color: '#000'
                });
                unitCount.setStroke('#fff', 4);
                unitCount.setOrigin(0);
                unit.add(unitCount);
            }
            
            unitSpace.add(unit);
            
            wrapCount++;
            
            if(this.unit_space_wrap && this.unit_space_wrap_per == wrapCount) {
                wrapCount = 0;
                xPos = 0;
                yPos += this.unit_size;
            } else {
                xPos += this.unit_size;
            }
        }
    }
    
    resetSpace() {
        //TODO remove all dice
    }
}