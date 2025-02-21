class Tasks extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_main_prize();
        this.create_rating_slider();
    }
    create_main_prize() {
        let cell_width = global_data.cell_width + 2;
        let item_bg = new Phaser.GameObjects.Rectangle(this.scene, 261, game_size.height / 2 + 100, 5 * cell_width, 9 * cell_width);
        item_bg.setStrokeStyle(5, 0x072279, 1);
        this.add(item_bg);
        let chest = new Phaser.GameObjects.Image(this.scene, 261, game_size.height / 2 - 50, 'game_play', 'chest_closed');
        chest.setScale(1.5);
        this.add(chest);
        let text = new Phaser.GameObjects.Text(this.scene, 261, game_size.height / 2 - 250, 'ADMIRAL REWARD', { fontFamily: 'rubik', fontSize: 32, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 261, game_size.height / 2 + 118, 'Log in every day and\nwin a special prize!', { fontFamily: 'rubik', fontSize: 28, color: '#051F79', align: 'center' });
        text.setOrigin(0.5);
        this.add(text);
        this.create_day_bar();
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
        this.day_bar.setPosition(261, game_size.height / 2 + 100 + 2.7 * cell_width);
        this.day_bar.setScale(0.6, 0.9);
        this.add(this.day_bar);
        this.day_bar_txt = new Phaser.GameObjects.Text(this.scene, 261, game_size.height / 2 + 100 + 1.7 * cell_width, `DAY ${global_data.user_data.daily_reward.amount + 1}/${global_data.daily_rewards.length}`, { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        this.day_bar_txt.setOrigin(0.5, 0.5);
        this.add(this.day_bar_txt);
    }
    create_rating_slider() {
        let cell_width = global_data.cell_width;
        let slider = new SliderBanner(this.scene, {
            width: cell_width * 18,
            height: cell_width * 10
        });
        this.add(slider);
        slider.setXY(16 * cell_width, 10 * cell_width);
        let scroller_yours = new Phaser.GameObjects.Image(this.scene, game_size.width - 2.1 * cell_width, 5 * cell_width, 'new', 'scroller');
        this.add(scroller_yours);
        slider.on('scrollProgress', (val) => {
            scroller_yours.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        let temp;
        let x = 8.6 * cell_width;
        let y;
        temp = new Phaser.GameObjects.Image(this.scene, 16.5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(1.59, 1);
        this.add(temp);
        for (let i = 0; i < 10; i++) {
            y = 1 * cell_width + i * 2.3 * cell_width;
            temp = new Phaser.GameObjects.Image(this.scene, 1.3 * cell_width, y, 'temp_task_reward');
            slider.add_child(temp);
            temp = new Phaser.GameObjects.Rectangle(this.scene, x + 0.3 * cell_width, y, 17 * cell_width, 2 * cell_width, 0x051F79, 0);
            temp.setStrokeStyle(5, 0x051F79, 1);
            slider.add_child(temp);
            temp = new Phaser.GameObjects.Text(this.scene, 3 * cell_width, y - 20, 'TASK NAME', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
            temp.setOrigin(0, 0.5);
            slider.add_child(temp);
            temp = new LoaderBar(this.scene, {
                atlas: 'new',
                frame_bg: 'plank',
                frame_bar: 'oil_progress'
            });
            temp.bg.setScale(0.73, 1);
            temp.update_progress(Math.random());
            temp.setPosition(x - 0.7 * cell_width, y + 30);
            temp.setScale(1.3, 0.7);
            slider.add_child(temp);
            temp = new Phaser.GameObjects.Image(this.scene, x + 440, y, 'new', 'blue_button');
            temp.setScale(0.8);
            slider.add_child(temp);
        }
    }
    show() {
    }
    handler_close() {
    }
}
