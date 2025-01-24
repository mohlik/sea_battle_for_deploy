class QuitBattleWindow extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
    }
    create_dark() {
        this.dark = new Phaser.GameObjects.Graphics(this.scene);
        this.dark.fillStyle(0x23232F, 0.6);
        this.dark.fillRect(0, 0, game_size.width, game_size.height);
        this.dark.setInteractive(new Phaser.Geom.Rectangle(0, 0, game_size.width, game_size.height), Phaser.Geom.Rectangle.Contains);
        this.dark.on('pointerup', this.handler_close);
    }
    create_bg() {
        let cell_width = global_data.cell_width + 2;
        let temp;
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xF4F6F9, 1);
        this.bg.fillRect(cell_width * -5.4, cell_width * -3.3, cell_width * 10.8, cell_width * 5.6);
        this.bg.lineStyle(12, 0x072279, 1);
        this.bg.strokeRect(cell_width * -5.4 + 6, cell_width * -3.3 + 6, cell_width * 10.8 - 12, cell_width * 5.6 - 12);
        this.bg.setInteractive(new Phaser.Geom.Rectangle(cell_width * -5.4, cell_width * -3.3, cell_width * 10.8, cell_width * 5.6), Phaser.Geom.Rectangle.Contains);
        this.add(this.bg);
        temp = new Phaser.GameObjects.Image(this.scene, -1, -2.8 * cell_width, 'new', 'plank');
        temp.setScale(1.025, 1);
        this.add(temp);
    }
    init() {
        let cell_width = global_data.cell_width + 2;
        let text;
        let button;
        this.create_bg();
        this.close_button = new CustomButton(this.scene, {
            x: cell_width * 4.9,
            y: cell_width * -2.8,
            atlas: 'game_play',
            frame_out: 'close_button',
            frame_over: 'close_button',
            frame_down: 'close_button',
            callback: () => {
                this.handler_close();
            }
        });
        this.add(this.close_button);
        text = new Phaser.GameObjects.Text(this.scene, 0, -2.8 * cell_width, 'QUIT GAME?', {
            fontFamily: 'rubik',
            fontSize: 36
        });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 0, -1 * cell_width, 'The bet will be returned!', {
            fontFamily: 'rubik',
            fontSize: 36,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        this.add(text);
        button = new CustomButton(this.scene, {
            x: cell_width * -2.5,
            y: cell_width * 1,
            atlas: 'new',
            frame_out: 'blue_button',
            callback: () => {
                this.handler_close();
                game_container.update_scenes('game_menu');
            }
        });
        this.add(button);
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'YES', {
            fontFamily: 'rubik',
            fontSize: 36
        });
        text.setOrigin(0.5);
        button.add(text);
        button = new CustomButton(this.scene, {
            x: cell_width * 2.5,
            y: cell_width * 1,
            atlas: 'new',
            frame_out: 'blue_button',
            callback: () => {
                this.handler_close();
            }
        });
        this.add(button);
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'NO', {
            fontFamily: 'rubik',
            fontSize: 36
        });
        text.setOrigin(0.5);
        button.add(text);
    }
    pre_show(params) {
    }
    post_show() {
    }
    handler_close() {
        game_container.windows_manager.close_window();
    }
}
