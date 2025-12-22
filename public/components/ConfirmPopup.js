import { Button } from "./Button.js";

export class ConfirmPopup extends Phaser.GameObjects.Container {
    constructor(config) {
        const { scene, x, y, w, h, action, btn } = config;

        super(scene, x, y);

        this.w = w;
        this.h = h;
        this.color = 0x464646;
        this.action = action;
        this.action_btn = btn;
        
        const zone = new Phaser.GameObjects.Zone(scene, 0, 0, scene.scale.width, scene.scale.height);
        zone.setOrigin(0);
        zone.setInteractive();
        this.add(zone);

        const bg = new Phaser.GameObjects.Rectangle(scene, 0, 0, scene.scale.width, scene.scale.height, 0x000000);
        bg.setOrigin(0);
        bg.setAlpha(0.75);
        this.add(bg);
        
        const popup = new Phaser.GameObjects.Container(scene, 0, 0);
        popup.x = (scene.scale.width - this.w) / 2;
        popup.y = (scene.scale.height - this.h) / 2;
        this.add(popup);
        this.popup = popup;

        const popupBg = new Phaser.GameObjects.Rectangle(scene, 0, 0, this.w, this.h, this.color);
        popupBg.setOrigin(0);
        popupBg.setAlpha(0.95);
        popup.add(popupBg);
        
        this.setAlpha(0);
        this.setDepth(20);
        
        this.addContent();
        
        this.fade_in = this.scene.tweens.add({
            targets: this,
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power3',
            persist: true
        });

        this.fade_out = this.scene.tweens.add({
            targets: this,
            alpha: { from: 1, to: 0 },
            duration: 500,
            ease: 'Power3',
            paused: true,
            onComplete: () => {
                this.setVisible(false);

                if(this.fade_in) this.fade_in.destroy();
                // this.scene.events.off('change_selector_input');

                this.destroy(true);
            }
        });
    }
    
    addContent() {
        switch(this.action.type) {
            case 'send_courtier':
                this.addSendCourtierContent();
                break;
            default:
                break;
        }
    }
    
    addSendCourtierContent() {
        let textContent = `Send courtier to castle gate for 2 coins?`;

        const text = new Phaser.GameObjects.Text(this.scene, 4, 8, textContent, {
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#fff'
        });
        text.x = (this.w - text.displayWidth) / 2;
        text.setStroke('#000', 2);
        text.setOrigin(0);
        this.popup.add(text);
        
        const buttonWrap = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.popup.add(buttonWrap);

        const buttonW = 80;
        const buttonH = 32;
        const buttonGap = 20;
        
        const data = {
            type: 'send_courtier'
        };
        
        const yesBtn = new Button({
            scene: this.scene,
            x: 0,
            y: 0,
            w: buttonW,
            h: buttonH,
            fontColor: '#000',
            fontSize: 16,
            text: 'Yes',
            parent: buttonWrap,
            onClick: () => {
                data.sent_courtier = true;
                this.scene.events.emit('confirm_send_courtier', data, this.action_btn);
                this.closePopup();
            }
        });
        yesBtn.button_text.x = (buttonW - yesBtn.button_text.displayWidth) / 2;
        yesBtn.button_text.y = (buttonH - yesBtn.button_text.displayHeight) / 2;
        
        const noBtn = new Button({
            scene: this.scene,
            x: buttonW + buttonGap,
            y: 0,
            w: buttonW,
            h: buttonH,
            fontColor: '#000',
            fontSize: 16,
            text: 'No',
            parent: buttonWrap,
            onClick: () => {
                data.sent_courtier = false;
                this.scene.events.emit('confirm_send_courtier', data, this.action_btn);
                this.closePopup();
            }
        });
        noBtn.button_text.x = (buttonW - noBtn.button_text.displayWidth) / 2;
        noBtn.button_text.y = (buttonH - noBtn.button_text.displayHeight) / 2;
        
        buttonWrap.x = this.w - (buttonW * 2) - buttonGap - 8;
        buttonWrap.y = this.h - buttonH - 8;
    }
    
    closePopup() {
        this.fade_out.play();
    }
}