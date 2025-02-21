class DailyRewardWindow extends Phaser.GameObjects.Container {
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
        this.bg.fillRect(cell_width * 1 - game_size.width / 2, cell_width * 1 - game_size.height / 2, cell_width * 26, cell_width * 12);
        this.bg.setInteractive();
        let count_y = 13;
        let count_x = 27;
        this.bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 1; y <= count_y; y++) {
            this.bg.lineBetween(cell_width * 1 - game_size.width / 2, y * cell_width - game_size.height / 2, cell_width * 27 - game_size.width / 2, y * cell_width - game_size.height / 2);
        }
        for (let x = 2; x <= count_x; x++) {
            this.bg.lineBetween(x * cell_width - game_size.width / 2, cell_width * 1 - game_size.height / 2, x * cell_width - game_size.width / 2, cell_width * 13 - game_size.height / 2);
        }
        this.bg.lineStyle(12, 0x072279, 1);
        this.bg.strokeRect(cell_width * 1 - game_size.width / 2 + 6, cell_width * 1 - game_size.height / 2 + 6, cell_width * 26 - 12, cell_width * 12 - 12);
        this.add(this.bg);
        temp = new Phaser.GameObjects.Image(this.scene, 7, -6.32 * cell_width, 'new', 'plank');
        temp.scaleX = 2.46;
        this.add(temp);
        let txt = new Phaser.GameObjects.Text(this.scene, 7, -6.32 * cell_width, 'DAILY REWARD', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        txt.setOrigin(0.5);
        this.add(txt);
    }
    create_interface() {
        let cell_width = global_data.cell_width + 2;
        let temp;
        let text;
        let button;
        this.close_button = new CustomButton(this.scene, {
            x: cell_width * 12.1,
            y: cell_width * -6.1,
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
    create_main_prize() {
        let cell_width = global_data.cell_width + 2;
        let item_bg = new Phaser.GameObjects.Rectangle(this.scene, -650, -5, 5 * cell_width, 9 * cell_width);
        item_bg.setStrokeStyle(5, 0x072279, 1);
        this.add(item_bg);
        let chest = new Phaser.GameObjects.Image(this.scene, -650, -150, 'game_play', 'chest_closed');
        chest.setScale(1.5);
        this.add(chest);
        let text = new Phaser.GameObjects.Text(this.scene, -650, -350, 'ADMIRAL REWARD', { fontFamily: 'rubik', fontSize: 32, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, -650, 18, 'Log in every day and\nwin a special prize!', { fontFamily: 'rubik', fontSize: 28, color: '#051F79', align: 'center' });
        text.setOrigin(0.5);
        this.add(text);
        this.create_day_bar();
    }
    create_items() {
        for (let day_i = 0; day_i < 14; day_i++) {
            let item_container = new Phaser.GameObjects.Container(this.scene, day_i % 7 * 190 - 370, Math.floor(day_i / 7) * 330 - 170);
            let item_bg = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, 170, 290);
            item_bg.setStrokeStyle(9, 0x072279, 1);
            item_container.add(item_bg);
            let plank = new Phaser.GameObjects.Image(this.scene, 0, -120, 'new', 'plank');
            plank.setScale(0.23, 0.8);
            item_container.add(plank);
            let txt_amount = new Phaser.GameObjects.Text(this.scene, 0, -120, 'DAY ' + (day_i + 1), { fontFamily: 'rubik', fontSize: 28, color: '#FFFFFF' });
            txt_amount.setOrigin(0.5);
            item_container.add(txt_amount);
            let prize_info = global_data.daily_rewards[day_i];
            if (prize_info.type === 'coins' || prize_info.type === 'gems') {
                let icon = new Phaser.GameObjects.Image(this.scene, 0, 0, 'shop', prize_info.icon);
                if (icon.width > 150)
                    icon.setScale(150 / icon.width);
                let txt_amount = new Phaser.GameObjects.Text(this.scene, 0, 100, String(prize_info.amount), { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
                txt_amount.setOrigin(0.5);
                item_container.add([icon, txt_amount]);
            }
            this.add(item_container);
        }
    }
    create_day_bar() {
        let cell_width = global_data.cell_width;
        this.day_bar = new LoaderBar(this.scene, {
            atlas: 'new',
            frame_bg: 'plank',
            frame_bar: 'oil_progress'
        });
        this.day_bar.bg.setScale(0.73, 1);
        this.day_bar.update_progress((global_data.user_data.daily_reward.amount + 1) / global_data.daily_rewards.length);
        this.day_bar.setPosition(-650, 2.7 * cell_width);
        this.day_bar.setScale(0.6, 0.9);
        this.add(this.day_bar);
        this.day_bar_txt = new Phaser.GameObjects.Text(this.scene, -650, 1.7 * cell_width, `DAY ${global_data.user_data.daily_reward.amount + 1}/${global_data.daily_rewards.length}`, { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        this.day_bar_txt.setOrigin(0.5, 0.5);
        this.add(this.day_bar_txt);
    }
    init() {
        let cell_width = global_data.cell_width + 2;
        this.create_bg();
        this.create_interface();
        this.create_items();
        this.create_main_prize();
    }
    pre_show(params) {
    }
    post_show() {
    }
    handler_close() {
        game_container.windows_manager.close_window();
    }
}
