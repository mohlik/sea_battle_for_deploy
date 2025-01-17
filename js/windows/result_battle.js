class ResultBattleWindow extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    create_dark() {
        this.dark = new Phaser.GameObjects.Graphics(this.scene);
        this.dark.fillStyle(0x23232F, 0.6);
        this.dark.fillRect(-game_size.width / 2, -game_size.height / 2, game_size.width, game_size.height);
        this.dark.setInteractive();
        this.dark.on('pointerup', this.handler_close);
        this.add(this.dark);
    }
    create_bg() {
        let cell_width = global_data.cell_width + 2;
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xE9E8E3, 1);
        this.bg.fillRect(cell_width * 4 - game_size.width / 2, cell_width * 2 - game_size.height / 2, cell_width * 20, cell_width * 11);
        this.bg.setInteractive();
        let count_y = 20;
        let count_x = 11;
        this.bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 0; y <= count_y; y++) {
            this.bg.lineBetween(cell_width * 4 - game_size.width / 2, y * cell_width - game_size.height / 2, cell_width * 24 - game_size.width / 2, y * cell_width - game_size.height / 2);
        }
        for (let x = 0; x <= count_x; x++) {
            this.bg.lineBetween(x * cell_width - game_size.width / 2, cell_width * 2 - game_size.height / 2, x * cell_width - game_size.width / 2, cell_width * 13 - game_size.height / 2);
        }
        this.add(this.bg);
    }
    init() {
        let cell_width = global_data.cell_width + 2;
        this.create_dark();
        this.create_bg();
        this.close_button = new CustomButton(this.scene, {
            x: cell_width * 24,
            y: cell_width * 2,
            atlas: 'game_play',
            frame_out: 'close_button',
            frame_over: 'close_button',
            frame_down: 'close_button',
            callback: () => {
                this.handler_close();
            }
        });
        this.add(this.close_button);
    }
    pre_show(params) {
    }
    post_show() {
    }
    handler_close() {
        game_container.windows_manager.close_window();
        game_container.update_scenes('game_menu');
    }
}
