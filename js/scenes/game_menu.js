class GameMenu extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        // this.bg = new Phaser.GameObjects.Graphics(this.scene);
        // this.bg.fillStyle(0x9BBA57, 1);
        // this.bg.fillRect(0, 0, game_size.width, game_size.height);
        // this.add(this.bg);
        this.bg = new Phaser.GameObjects.Image(this.scene, game_size.width / 2, game_size.height / 2, 'map_bg');
        this.bg.setScale(game_size.height / this.bg.height);
        this.add(this.bg);
        this.create_game_map();
        this.darker = new Phaser.GameObjects.Image(this.scene, 0, 0, 'darkner');
        this.darker.setOrigin(0);
        this.darker.setScale(game_size.width / this.darker.width, game_size.height / this.darker.height);
        this.add(this.darker);
        this.create_interface();
    }
    create_game_map() {
        this.game_map = new GameMap(this.scene);
        this.add(this.game_map);
    }
    create_interface() {
        this.profile_container = new Phaser.GameObjects.Container(this.scene, 100, 120);
        this.add(this.profile_container);
        this.ava_frame = new Phaser.GameObjects.Image(this.scene, 20, 20, 'ava_frame');
        this.ava = new Phaser.GameObjects.Image(this.scene, this.ava_frame.x, this.ava_frame.y, 'new', 'profile_ava');
        this.profile_bg = new Phaser.GameObjects.Image(this.scene, this.ava.x + this.ava.width / 2, this.ava.y - this.ava.height / 2, 'game_menu', 'medium_back');
        this.profile_bg.setInteractive();
        this.profile_bg.on('pointerup', () => {
            game_container.big_windows.update_scenes('profile');
            game_container.update_scenes('big_windows');
        });
        this.profile_bg.setOrigin(0);
        this.profile_container.add([this.ava_frame, this.profile_bg, this.ava]);
        this.custom_button = new CustomButton(this.scene, {
            x: this.profile_bg.x + this.profile_container.x,
            y: 0,
            atlas: 'game_menu',
            frame_out: 'little_back',
            callback: () => {
                game_container.big_windows.update_scenes('personalization');
                game_container.update_scenes('big_windows');
                // game_container.windows_manager.show_window('test', {});
                // game_container.windows_manager.show_window('result_battle');
            }
        });
        this.custom_button.scale = 1.1;
        this.custom_button.x += (this.profile_bg.width + this.custom_button.out_img.width / 2 + 15);
        this.custom_button.y += this.profile_bg.height / 2 - 10;
        this.add(this.custom_button);
        this.settings_button = new CustomButton(this.scene, {
            x: game_size.width - 20,
            y: this.profile_bg.y + this.profile_container.y,
            atlas: 'game_menu',
            frame_out: 'micro_back',
            callback: () => {
                // game_container.big_windows.update_scenes('settings');
                // game_container.update_scenes('big_windows');
                game_container.windows_manager.show_window('options');
                // game_container.windows_manager.show_window('test', {});
                // game_container.windows_manager.show_window('result_battle');
            }
        });
        this.settings_button.setOrigin(1, 0);
        this.add(this.settings_button);
        this.play_button = new CustomButton(this.scene, {
            x: game_size.width - 20,
            y: game_size.height - 20,
            atlas: 'game_menu',
            frame_out: 'big_back',
            callback: () => {
                // game_container.update_scenes('game_play');
                if (global_data['game_play']['with_bot'])
                    game_container.windows_manager.show_window('arena_slider');
                else {
                    game_container.game_play.update_scenes('prepare_field');
                    game_container.update_scenes('game_play');
                }
            }
        });
        this.play_button.setOrigin(1);
        this.add(this.play_button);
        let temp = new Phaser.GameObjects.Image(this.scene, -100, 0, 'game_menu', 'icon_play');
        this.play_button.add(temp);
        let text_play = new Phaser.GameObjects.Text(this.scene, 50, 0, 'BATTLE', { fontFamily: 'rubik', fontSize: 48 });
        text_play.setOrigin(0.5);
        this.play_button.add(text_play);
        this.mode_button_container = new Phaser.GameObjects.Container(this.scene, this.play_button.x - (this.play_button.out_img.width / 2 + 20), this.play_button.y + this.play_button.out_img.height / 2);
        this.add(this.mode_button_container);
        let mode_text = new Phaser.GameObjects.Text(this.scene, -150, -120, 'BOT GAME', { fontFamily: 'rubik', fontSize: 28, color: '#3C2415' });
        mode_text.setOrigin(0.5);
        this.mode_bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'game_menu', 'medium_back');
        this.mode_bg.setOrigin(1);
        this.mode_bg.setInteractive();
        this.mode_bg.on('pointerup', () => {
            if (this.mode_img.frame.name === 'icon_bot') {
                global_data['game_play']['with_bot'] = false;
                this.mode_img.setFrame('icon_friend');
                this.mode_img.x = -240;
                mode_text.text = 'FRIENDS GAME';
                mode_text.setFontSize(22);
            }
            else {
                global_data['game_play']['with_bot'] = true;
                this.mode_img.setFrame('icon_bot');
                this.mode_img.x = -250;
                mode_text.text = 'BOT GAME';
                mode_text.setFontSize(28);
            }
            this.mode_img.setOrigin(1);
        });
        this.mode_img = new Phaser.GameObjects.Image(this.scene, -250, -50, 'game_menu', 'icon_bot');
        this.mode_img.setOrigin(1);
        // this.mode_arrow = new Phaser.GameObjects.Image(this.scene, -50, -70, 'arrow');
        // this.mode_arrow.setOrigin(1);
        this.mode_button_container.add([
            this.mode_bg,
            this.mode_img,
            // this.mode_arrow
        ]);
        let rect = new Phaser.GameObjects.Rectangle(this.scene, -130, -70, 180, 40, 0x3C2415, 1);
        this.mode_button_container.add(rect);
        this.mode_button_container.add(mode_text);
        let text = new Phaser.GameObjects.Text(this.scene, -120, -70, 'REWARD X2', { fontFamily: 'rubik', fontSize: 24, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.mode_button_container.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, -220, -70, 'game_menu', 'coin');
        temp.setScale(0.65);
        this.mode_button_container.add(temp);
        // this.create_banner();
        this.create_buttons();
    }
    create_banner() {
        let temp = new Phaser.GameObjects.Image(this.scene, 20, game_size.height - 20, 'game_menu', 'big_back');
        temp.setOrigin(0, 1);
        this.add(temp);
        let text = new Phaser.GameObjects.Text(this.scene, temp.x + (temp.width / 2), temp.y - (temp.height / 2), 'BANNER', { fontFamily: 'rubik', fontSize: 48, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
    }
    create_buttons() {
        let pos = [
            { x: 150, y: game_size.height / 2 },
            { x: 150, y: game_size.height / 2 + 200 },
            { x: game_size.width - 150, y: game_size.height / 2 - 200 },
            { x: game_size.width - 150, y: game_size.height / 2 },
            { x: game_size.width - 150, y: game_size.height / 2 + 200 }
        ];
        let button;
        let icon;
        let text;
        button = new CustomButton(this.scene, {
            x: pos[0].x,
            y: pos[0].y,
            atlas: 'game_menu',
            frame_out: 'basic_button',
            callback: () => {
                game_container.big_windows.update_scenes('leaderboard');
                game_container.update_scenes('big_windows');
            }
        });
        icon = new Phaser.GameObjects.Image(this.scene, 0, -15, 'game_menu', 'icon_leaderboard');
        text = new Phaser.GameObjects.Text(this.scene, 0, 35, 'TOP', { fontFamily: 'rubik', fontSize: 24, color: '#3C2415' });
        text.setOrigin(0.5);
        button.add([icon, text]);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: pos[1].x,
            y: pos[1].y,
            atlas: 'game_menu',
            frame_out: 'basic_button',
            callback: () => {
                game_container.windows_manager.show_window('daily_reward');
            }
        });
        icon = new Phaser.GameObjects.Image(this.scene, 0, -15, 'game_menu', 'icon_daily');
        text = new Phaser.GameObjects.Text(this.scene, 0, 35, 'DAILY', { fontFamily: 'rubik', fontSize: 24, color: '#3C2415' });
        text.setOrigin(0.5);
        button.add([icon, text]);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: pos[2].x,
            y: pos[2].y,
            atlas: 'game_menu',
            frame_out: 'basic_button',
            callback: () => {
                game_container.big_windows.update_scenes('tasks');
                game_container.update_scenes('big_windows');
            }
        });
        this.add(button);
        icon = new Phaser.GameObjects.Image(this.scene, 0, -15, 'game_menu', 'icon_tasks');
        text = new Phaser.GameObjects.Text(this.scene, 0, 35, 'MISSION', { fontFamily: 'rubik', fontSize: 18, color: '#3C2415' });
        text.setOrigin(0.5);
        button.add([icon, text]);
        button = new CustomButton(this.scene, {
            x: pos[3].x,
            y: pos[3].y,
            atlas: 'game_menu',
            frame_out: 'basic_button',
            callback: () => {
                game_container.big_windows.update_scenes('shop');
                game_container.update_scenes('big_windows');
            }
        });
        icon = new Phaser.GameObjects.Image(this.scene, 0, -15, 'game_menu', 'icon_store');
        text = new Phaser.GameObjects.Text(this.scene, 0, 35, 'STORE', { fontFamily: 'rubik', fontSize: 24, color: '#3C2415' });
        text.setOrigin(0.5);
        button.add([icon, text]);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: pos[4].x,
            y: pos[4].y,
            atlas: 'game_menu',
            frame_out: 'basic_button',
            callback: () => {
                this.game_map.active_map = !this.game_map.active_map;
            }
        });
        icon = new Phaser.GameObjects.Image(this.scene, 0, -15, 'game_menu', 'icon_city');
        text = new Phaser.GameObjects.Text(this.scene, 0, 35, 'CITY', { fontFamily: 'rubik', fontSize: 24, color: '#3C2415' });
        text.setOrigin(0.5);
        button.add([icon, text]);
        this.add(button);
    }
}
