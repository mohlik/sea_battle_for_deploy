class SaveFieldWindow extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
    }
    create_bg() {
        let cell_width = global_data.cell_width + 2;
        let temp;
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xE9E8E3, 1);
        this.bg.fillRect(cell_width * 9 - game_size.width / 2, cell_width * 2 - game_size.height / 2, cell_width * 10, cell_width * 13);
        this.bg.setInteractive(new Phaser.Geom.Rectangle(cell_width * 9 - game_size.width / 2, cell_width * 2 - game_size.height / 2, cell_width * 10, cell_width * 13), Phaser.Geom.Rectangle.Contains);
        let count_y = 13;
        let count_x = 10;
        this.bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 2; y <= count_y + 1; y++) {
            this.bg.lineBetween(cell_width * 9 - game_size.width / 2, y * cell_width - game_size.height / 2, cell_width * 19 - game_size.width / 2, y * cell_width - game_size.height / 2);
        }
        for (let x = 9; x <= count_x + 9; x++) {
            this.bg.lineBetween(x * cell_width - game_size.width / 2, cell_width * 2 - game_size.height / 2, x * cell_width - game_size.width / 2, cell_width * 15 - game_size.height / 2);
        }
        // this.bg.lineStyle(12, 0x072279, 1);
        // this.bg.strokeRect(cell_width * 9 - game_size.width / 2 + 6, cell_width * 2 - game_size.height / 2 + 6, cell_width * 10 - 12, cell_width * 13 - 12);
        this.add(this.bg);
        temp = new Phaser.GameObjects.Image(this.scene, 7, -cell_width * 5.32, 'game_play', 'medium_plank');
        temp.scale = 0.95;
        this.add(temp);
    }
    create_slider() {
        let cell_width = global_data.cell_width + 2;
        this.save_slider = new SliderBanner(this.scene, {
            width: cell_width * 10,
            height: cell_width * 12
        });
        this.add(this.save_slider);
        this.save_slider.setXY(0.3 * cell_width, 0.5 * cell_width, 14.3 * cell_width, -9 * cell_width);
        this.outer_objects.push(this.save_slider.rect_mask);
        let temp;
        [
            'atom',
            'bomber',
            'torpedo',
            'fighter',
            // 'airdef',
            // 'submarine',
            'radar',
            // 'mine'
        ].forEach((skill_name, i) => {
            temp = new Phaser.GameObjects.Image(this.scene, cell_width * 4.6, i * cell_width * 4 + 1.8 * cell_width, 'skill_item');
            this.save_slider.add_child(temp);
            temp.setInteractive();
            temp.on('pointerdown', () => {
                this.save_slider.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!this.save_slider.was_move) {
                    // this.handler_buy(skill_name);
                }
                else {
                    this.save_slider.was_move = false;
                }
                this.save_slider.pointer_down = false;
            });
            temp.on('pointerout', () => {
                this.save_slider.pointer_down = false;
                this.save_slider.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                this.save_slider.emit('pointermove', pointer);
            });
        });
    }
    init() {
        this.outer_objects = [];
        let cell_width = global_data.cell_width + 2;
        this.create_bg();
        this.create_slider();
        this.close_button = new CustomButton(this.scene, {
            x: cell_width * 4.5,
            y: cell_width * -5.25,
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
        // game_container.update_scenes('game_menu');
    }
}
