class ArenaSlidereWindow extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
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
        let temp;
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xE9E8E3, 1);
        this.bg.fillRect(cell_width * 4 - game_size.width / 2, cell_width * 2 - game_size.height / 2, cell_width * 20, cell_width * 11);
        this.bg.setInteractive();
        let count_y = 14;
        let count_x = 23;
        this.bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 2; y <= count_y - 2; y++) {
            this.bg.lineBetween(cell_width * 4 - game_size.width / 2, y * cell_width - game_size.height / 2, cell_width * 24 - game_size.width / 2, y * cell_width - game_size.height / 2);
        }
        for (let x = 4; x <= count_x; x++) {
            this.bg.lineBetween(x * cell_width - game_size.width / 2, cell_width * 2 - game_size.height / 2, x * cell_width - game_size.width / 2, cell_width * 13 - game_size.height / 2);
        }
        this.bg.lineStyle(12, 0x072279, 1);
        this.bg.strokeRect(cell_width * 4 - game_size.width / 2 + 6, cell_width * 2 - game_size.height / 2 + 6, cell_width * 20 - 12, cell_width * 11 - 12);
        this.add(this.bg);
        temp = new Phaser.GameObjects.Image(this.scene, 5, -5.32 * cell_width, 'new', 'plank');
        temp.scaleX = 1.9;
        this.add(temp);
    }
    create_interface() {
        let cell_width = global_data.cell_width + 2;
        let temp;
        let text;
        let button;
        this.close_button = new CustomButton(this.scene, {
            x: cell_width * 9.1,
            y: cell_width * -5.1,
            atlas: 'game_play',
            frame_out: 'close_button',
            frame_over: 'close_button',
            frame_down: 'close_button',
            callback: () => {
                this.handler_close();
            }
        });
        this.add(this.close_button);
        temp = new Phaser.GameObjects.Image(this.scene, 0, -4.3 * cell_width, 'new', 'header');
        temp.setScale(1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, -3.3 * cell_width, 'BLACK SEA', {
            fontFamily: 'rubik',
            fontSize: 48,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        this.add(text);
        // text = new Phaser.GameObjects.Text(
        //     this.scene,
        //     0,
        //     -1.9 * cell_width,
        //     'ADVANCED MODE',
        //     {
        //         fontFamily: 'rubik',
        //         fontSize: 36,
        //         color: '#051F79'
        //     }
        // )
        // text.setOrigin(0.5);
        // this.add(text);
        for (let i = 0; i < 3; i++) {
            temp = new Phaser.GameObjects.Image(this.scene, (i - 1) * 6 * cell_width, 1 * cell_width, 'new', 'arena_item');
            temp.setScale(1);
            this.add(temp);
            if (i === 0) {
                temp = new Phaser.GameObjects.Image(this.scene, (i - 1) * 6 * cell_width, 1 * cell_width, 'new', 'chest_mini');
                temp.setScale(1);
                this.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, (i - 1) * 6 * cell_width, -0.5 * cell_width, 'REWARD', {
                    fontFamily: 'rubik',
                    fontSize: 36,
                });
                text.setOrigin(0.5);
                this.add(text);
                text = new Phaser.GameObjects.Text(this.scene, (i - 1) * 6 * cell_width, 2 * cell_width, '0 $', {
                    fontFamily: 'rubik',
                    fontSize: 36,
                    color: '#051F79'
                });
                text.setOrigin(0.5);
                this.add(text);
            }
            else if (i === 1) {
                temp = new Phaser.GameObjects.Image(this.scene, (i - 1) * 6 * cell_width, 1 * cell_width, 'new', 'home_icon');
                temp.setScale(1);
                this.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, (i - 1) * 6 * cell_width, -0.5 * cell_width, 'OPEN BULDING', {
                    fontFamily: 'rubik',
                    fontSize: 36,
                });
                text.setOrigin(0.5);
                this.add(text);
                text = new Phaser.GameObjects.Text(this.scene, (i - 1) * 6 * cell_width, 2 * cell_width, '0/0', {
                    fontFamily: 'rubik',
                    fontSize: 36,
                    color: '#051F79'
                });
                text.setOrigin(0.5);
                this.add(text);
            }
            else if (i === 2) {
                temp = new Phaser.GameObjects.Image(this.scene, (i - 1) * 6 * cell_width, 1 * cell_width, 'new', 'ticket_icon');
                temp.setScale(1);
                this.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, (i - 1) * 6 * cell_width, -0.5 * cell_width, 'ENTRY STAKE', {
                    fontFamily: 'rubik',
                    fontSize: 36,
                });
                text.setOrigin(0.5);
                this.add(text);
                text = new Phaser.GameObjects.Text(this.scene, (i - 1) * 6 * cell_width, 2 * cell_width, '0 $', {
                    fontFamily: 'rubik',
                    fontSize: 36,
                    color: '#051F79'
                });
                text.setOrigin(0.5);
                this.add(text);
            }
        }
        let advanced_circ = new Phaser.GameObjects.Arc(this.scene, -7.3 * cell_width, 6 * cell_width, 20, 0, 360, false, 0x30DE06, 1);
        advanced_circ.setStrokeStyle(5, 0x001C65, 1);
        let classic_circ = new Phaser.GameObjects.Arc(this.scene, 1.8 * cell_width, 6 * cell_width, 20, 0, 360, false, 0x001C65, 1);
        classic_circ.setStrokeStyle(5, 0x001C65, 1);
        temp = new Phaser.GameObjects.Image(this.scene, -4.5 * cell_width, 6 * cell_width, 'new', 'big_blue_button');
        temp.alpha = 1;
        temp.setInteractive();
        temp.on('pointerup', () => {
            classic_circ.setFillStyle(0x001C65, 1);
            advanced_circ.setFillStyle(0x30DE06, 1);
            global_data['game_play']['advanced'] = true;
        });
        this.add(temp);
        this.add(advanced_circ);
        text = new Phaser.GameObjects.Text(this.scene, -4.5 * cell_width, 6 * cell_width, 'ADVANCED MODE', {
            fontFamily: 'rubik',
            fontSize: 36,
        });
        text.alpha = 1;
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, 4.5 * cell_width, 6 * cell_width, 'new', 'big_blue_button');
        temp.alpha = 1;
        temp.setInteractive();
        temp.on('pointerup', () => {
            advanced_circ.setFillStyle(0x001C65, 1);
            classic_circ.setFillStyle(0x30DE06, 1);
            global_data['game_play']['advanced'] = false;
        });
        this.add(temp);
        this.add(classic_circ);
        text = new Phaser.GameObjects.Text(this.scene, 4.5 * cell_width, 6 * cell_width, 'CLASSIC MODE', {
            fontFamily: 'rubik',
            fontSize: 36,
        });
        text.alpha = 1;
        text.setOrigin(0.5);
        this.add(text);
        button = new CustomButton(this.scene, {
            x: 0,
            y: cell_width * 4,
            atlas: 'new',
            frame_out: 'red_button',
            callback: () => {
                this.handler_close();
                game_container.update_scenes('game_play');
            }
        });
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'PLAY', {
            fontFamily: 'rubik',
            fontSize: 36,
        });
        text.setOrigin(0.5);
        button.add(text);
        this.add(button);
    }
    init() {
        let cell_width = global_data.cell_width + 2;
        this.create_bg();
        this.create_interface();
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
        if (params)
            this.win = params.win;
    }
    post_show() {
        let cell_width = global_data.cell_width + 2;
    }
    handler_close() {
        game_container.windows_manager.close_window();
        game_container.update_scenes('game_menu');
    }
}
