import { CardSection } from "./CardSection.js";

export class FloorCard extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, card } = config;

        super(scene, x, y);
        
        this.w = w;
        this.h = h;
        this.card = card;
        this.section_w = w;
        this.section_h = h/3;
        this.sections = [];
        
        let yPos = 0;
        for(let i=0; i<card.sizes.length; i++) {
            const sectionW = this.section_w;
            const sectionH = this.section_h * card.sizes[i];
            const sectionColor = card.scrolls[i] == 1 ? 'black' : 'white';
            
            const section = new CardSection({
                scene: scene,
                x: 0,
                y: yPos,
                w: sectionW,
                h: sectionH,
                color: sectionColor,
                action: card.sections[i]
            });
            
            this.add(section);
            this.sections.push(section);
            
            yPos += sectionH;
        }
    }
}