class CustomButton extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }
    init(params) {
        this.clickable = true;
        this.x = params.x;
        this.y = params.y;
        this.callback = params.callback;
        let { atlas, frame_out, frame_over, frame_down } = params;
        let over_default = false;
        let down_default = false;
        if (!frame_over) {
            over_default = true;
            frame_over = frame_out;
        }
        if (!frame_down) {
            down_default = true;
            frame_down = frame_out;
        }
        this.out_img = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_out, atlas ? frame_out : null);
        this.over_img = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_over, atlas ? frame_over : null);
        this.down_img = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_down, atlas ? frame_down : null);
        this.add([this.out_img, this.over_img, this.down_img]);
        this.create_interactive(over_default, down_default);
    }
    create_interactive(over_default, down_default) {
        this.out_img.setInteractive({ useHandCursor: true });
        this.set_out(over_default || down_default);
        this.out_img.on('pointerdown', () => {
            if (this.clickable)
                this.set_down(down_default);
        });
        this.out_img.on('pointerover', () => {
            if (this.clickable)
                this.set_over(over_default);
        });
        this.out_img.on('pointerout', () => {
            if (this.clickable)
                this.set_out(over_default || down_default);
        });
        this.out_img.on('pointerup', () => {
            if (this.was_down) {
                this.set_out(over_default || down_default);
                this.callback();
                this.was_down = false;
            }
        });
    }
    set_handler(_callback) {
        this.callback = _callback;
    }
    setOrigin(x, y) {
        if (!y && y !== 0)
            y = x;
        this.x -= (x - 0.5) * this.out_img.width;
        this.y -= (y - 0.5) * this.out_img.height;
    }
    set_over(over_default) {
        if (over_default) {
            if (this.scene)
                this.scene.tweens.add({
                    targets: this.out_img,
                    scale: 1.05,
                    duration: 20,
                    onStart: () => {
                        this.clickable = false;
                    },
                    onComplete: () => {
                        this.clickable = true;
                    }
                });
        }
        else {
            this.over_img.visible = true;
            this.down_img.visible = false;
        }
    }
    set_out(any_default) {
        if (any_default) {
            this.over_img.visible = false;
            this.down_img.visible = false;
            if (this.scene)
                this.scene.tweens.add({
                    targets: this.out_img,
                    scale: 1,
                    duration: 20,
                    onStart: () => {
                        this.clickable = false;
                    },
                    onComplete: () => {
                        this.clickable = true;
                    }
                });
        }
        else {
            this.over_img.visible = false;
            this.down_img.visible = false;
            this.was_down = false;
        }
    }
    set_down(down_default) {
        if (down_default) {
            if (this.scene)
                this.scene.tweens.add({
                    targets: this.out_img,
                    scale: 0.95,
                    duration: 20,
                    onStart: () => {
                        this.clickable = false;
                    },
                    onComplete: () => {
                        this.clickable = true;
                        this.was_down = true;
                    }
                });
        }
        else {
            this.over_img.visible = false;
            this.down_img.visible = true;
            this.was_down = true;
        }
    }
}
