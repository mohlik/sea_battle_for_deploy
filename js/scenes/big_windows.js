class BigWindows extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.cell_width = global_data.cell_width;
        this.create_back();
        this.create_interface();
        this.create_scenes();
    }
    create_back() {
        let temp;
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xE9E8E3, 1);
        this.bg.fillRect(0, 0, game_size.width, game_size.height);
        this.add(this.bg);
        let count_y = Math.ceil(game_size.height / this.cell_width);
        let count_x = Math.ceil(game_size.width / this.cell_width);
        this.bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 0; y <= count_y; y++) {
            this.bg.lineBetween(0, y * this.cell_width, game_size.width, y * this.cell_width);
        }
        for (let x = 0; x <= count_x; x++) {
            this.bg.lineBetween(x * this.cell_width, 0, x * this.cell_width, game_size.height);
        }
        this.bg.lineStyle(7, 0xCF4038, 0.9);
        this.bg.lineBetween(0, 3 * this.cell_width, game_size.width, 3 * this.cell_width);
    }
    create_scenes() {
        this.profile = new Profile(this.scene);
        this.personalization = new Personalization(this.scene);
        this.settings = new Settings(this.scene);
        this.leaderboard = new Leaderboard(this.scene);
        this.shop = new Shop(this.scene);
        this.add([this.profile, this.personalization, this.settings, this.leaderboard, this.shop]);
        this.update_scenes('profile');
    }
    update_scenes(scene_id) {
        const condition = {
            'profile': this.profile,
            'personalization': this.personalization,
            'settings': this.settings,
            'leaderboard': this.leaderboard,
            'shop': this.shop
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
        let temp;
        this.home_button = new CustomButton(this.scene, {
            x: 6.5 * this.cell_width,
            y: 1.5 * this.cell_width,
            atlas: 'new',
            frame_out: 'plank',
            callback: () => {
                game_container.update_scenes('game_menu');
            }
        });
        this.home_button.out_img.setScale(0.65, 1);
        temp = new Phaser.GameObjects.Image(this.scene, -4 * this.cell_width, 0, 'game_play', 'back_icon');
        this.home_button.add(temp);
        let text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'MAIN MENU', { fontFamily: 'rubik', fontSize: 36 });
        text.setOrigin(0.5);
        this.home_button.add(text);
        this.add(this.home_button);
    }
}
