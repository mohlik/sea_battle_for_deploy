class GamePlay extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.cell_width = global_data.cell_width;
        this.create_back();
        this.create_interface();
        // this.create_field();
        this.create_scenes();
    }
    create_back() {
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xF2E9D5, 1);
        this.bg.fillRect(0, 0, game_size.width, game_size.height);
        this.add(this.bg);
        let count_y = Math.ceil(game_size.height / this.cell_width);
        let count_x = Math.ceil(game_size.width / this.cell_width);
        this.bg.lineStyle(2, 0x7692CD, 0.9);
        for (let y = 0; y <= count_y; y++) {
            this.bg.lineBetween(0, y * this.cell_width, game_size.width, y * this.cell_width);
        }
        for (let x = 0; x <= count_x; x++) {
            this.bg.lineBetween(x * this.cell_width, 0, x * this.cell_width, game_size.height);
        }
    }
    create_scenes() {
        this.game_play = new GamePlayScene(this.scene, {});
        this.prepare_field = new PrepareField(this.scene, {});
        this.add([this.game_play, this.prepare_field]);
        this.update_scenes('prepare_field');
    }
    update_scenes(scene_id) {
        const condition = {
            'prepare_field': this.prepare_field,
            'game_play': this.game_play,
        };
        let _visible = false;
        Object.keys(condition).forEach((condition_key) => {
            if (condition_key === scene_id)
                _visible = true;
            else
                _visible = false;
            if (condition[condition_key])
                condition[condition_key].visible = _visible;
            if (_visible)
                condition[condition_key].show();
            else
                condition[condition_key].handler_close();
        });
    }
    create_interface() {
        this.settings_button = new CustomButton(this.scene, {
            x: game_size.width - 20,
            y: 20,
            frame_out: 'settings_button',
            callback: () => {
                game_container.windows_manager.show_window('test', {});
            }
        });
        this.settings_button.setOrigin(1, 0);
        this.add(this.settings_button);
        this.home_button = new CustomButton(this.scene, {
            x: 20,
            y: 20,
            frame_out: 'home_button',
            callback: () => {
                game_container.update_scenes('game_menu');
                this.prepare_field.handler_close();
            }
        });
        this.home_button.setOrigin(0);
        this.add(this.home_button);
    }
}
