class Settings extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_static_images();
        this.create_texts();
        this.create_volume_control();
        this.create_fullscreen_control();
        this.create_language_control();
        this.create_privacy_policy();
    }
    show() {
    }
    create_static_images() {
        let cell_width = global_data.cell_width;
        let temp;
        // temp = new Phaser.GameObjects.Image(this.scene, 7.5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        // temp.setScale(1.02, 0.98);
        // this.add(temp);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(game_size.width / 2 - 6 * cell_width, 4.5 * cell_width, game_size.width / 2 + 6 * cell_width, 4.5 * cell_width);
        graphics.lineBetween(game_size.width / 2 - 6 * cell_width, 6.5 * cell_width, game_size.width / 2 + 6 * cell_width, 6.5 * cell_width);
        this.add(graphics);
    }
    create_texts() {
        let cell_width = global_data.cell_width;
        let text;
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 3.5, 'MUSIC', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 5.5, 'EFFECT AND VOICE', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 7.5, 'SCREEN MODE', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 9.5, 'LANGUAGE', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
    }
    create_language_control() {
        let cell_width = global_data.cell_width;
        let temp;
        let text;
        let button;
        temp = new Phaser.GameObjects.Image(this.scene, game_size.width / 2, 10.5 * cell_width, 'new', 'flag_micro');
        temp.scale = 1.3;
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, 11.5 * cell_width, 'УКРАЇНСЬКА', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        button = new CustomButton(this.scene, {
            x: game_size.width / 2 - 3.5 * cell_width,
            y: cell_width * 11.5,
            atlas: 'game_play',
            frame_out: 'back_icon',
            callback: () => {
            }
        });
        this.add(button);
        button = new CustomButton(this.scene, {
            x: game_size.width / 2 + 3.5 * cell_width,
            y: cell_width * 11.5,
            atlas: 'game_play',
            frame_out: 'back_icon',
            callback: () => {
            }
        });
        button.out_img.setFlipX(true);
        this.add(button);
    }
    create_volume_control() {
        let cell_width = global_data.cell_width;
        let scroller_music = new Phaser.GameObjects.Image(this.scene, game_size.width / 2 - 6 * cell_width, 4.55 * cell_width, 'new', 'scroller');
        this.add(scroller_music);
        scroller_music.setInteractive({ draggable: true });
        scroller_music.on('drag', (pointer, dragX, dragY) => {
            if (dragX > (game_size.width / 2 - 6 * cell_width) && dragX < (game_size.width / 2 + 6 * cell_width))
                scroller_music.x = dragX;
        });
        scroller_music.on('dragend', () => {
        });
        let scroller_sound = new Phaser.GameObjects.Image(this.scene, game_size.width / 2 - 6 * cell_width, 6.55 * cell_width, 'new', 'scroller');
        this.add(scroller_sound);
    }
    create_fullscreen_control() {
        let cell_width = global_data.cell_width;
        let temp;
        let text;
        let button;
        button = new CustomButton(this.scene, {
            x: game_size.width / 2 - 3.5 * cell_width,
            y: cell_width * 8.5,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: () => {
                this.handler_privacy_policy();
            }
        });
        button.out_img.scaleX = 1.25;
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'WINDOW', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        button.add(text);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: game_size.width / 2 + 3.5 * cell_width,
            y: cell_width * 8.5,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: () => {
                this.handler_privacy_policy();
            }
        });
        button.out_img.scaleX = 1.25;
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'FULLSCREEN', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        button.add(text);
        this.add(button);
    }
    create_privacy_policy() {
        let cell_width = global_data.cell_width;
        let temp;
        let text;
        let button;
        button = new CustomButton(this.scene, {
            x: game_size.width / 2,
            y: cell_width * 13.5,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: () => {
                this.handler_privacy_policy();
            }
        });
        button.out_img.scaleX = 1.5;
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'PRIVACY POLICY', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        button.add(text);
        this.add(button);
    }
    handler_privacy_policy() {
    }
    handler_close() {
    }
}
