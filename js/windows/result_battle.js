class ResultBattleWindow extends Phaser.GameObjects.Container {
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
        text = new Phaser.GameObjects.Text(this.scene, 5, -5.3 * cell_width, 'RESULT OF THE BATTLE', {
            fontFamily: 'rubik',
            fontSize: 36
        });
        text.setOrigin(0.5);
        this.add(text);
        this.result_plank = new Phaser.GameObjects.Container(this.scene, 5, -3.9 * cell_width);
        temp = new Phaser.GameObjects.Image(this.scene, 0, 0, 'new', 'plank');
        temp.setScale(0.4, 0.8);
        this.result_plank.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'WINNER', {
            fontFamily: 'rubik',
            fontSize: 28
        });
        text.setOrigin(0.5);
        this.result_plank.add(text);
        this.add(this.result_plank);
        temp = new Phaser.GameObjects.Image(this.scene, 5, -3.9 * cell_width, 'new', 'micro_plank');
        temp.setScale(5.5, 1.5);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 5, -3.9 * cell_width, 'BATTLE IS OVER!', {
            fontFamily: 'rubik',
            fontSize: 36
        });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, 5, -2.33 * cell_width, 'new', 'plank');
        temp.setScale(0.57, 1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 5, -2.33 * cell_width, 'REWARD!', {
            fontFamily: 'rubik',
            fontSize: 28
        });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, -6.2 * cell_width, -1.5 * cell_width, 'new', 'profile_ava');
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, -6.2 * cell_width, 1 * cell_width, 'new', 'plank');
        temp.setScale(0.4, 1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, -6.2 * cell_width, 1 * cell_width, global_data.user_data.name.toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 28
        });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, -6.2 * cell_width, 2 * cell_width, 'new', 'plank');
        temp.setScale(0.4, 1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, -6.2 * cell_width, 2 * cell_width, global_data.user_data.rank.stage.toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 28
        });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, 6.4 * cell_width, -1.5 * cell_width, 'new', 'profile_ava');
        temp.setFlipX(true);
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 6.4 * cell_width, 1 * cell_width, 'new', 'plank');
        temp.setScale(0.4, 1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 6.4 * cell_width, 1 * cell_width, 'Bot'.toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 28
        });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, 6.4 * cell_width, 2 * cell_width, 'new', 'plank');
        temp.setScale(0.4, 1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 6.4 * cell_width, 2 * cell_width, global_data.user_data.rank.stage.toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 28
        });
        text.setOrigin(0.5);
        this.add(text);
    }
    init() {
        let cell_width = global_data.cell_width + 2;
        // this.create_dark();
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
        this.scene.tweens.add({
            targets: this.result_plank,
            x: (this.win ? -6.2 : 6.4) * cell_width,
            duration: 500,
            ease: 'back.out'
        });
    }
    handler_close() {
        game_container.windows_manager.close_window();
        game_container.update_scenes('game_menu');
    }
}
