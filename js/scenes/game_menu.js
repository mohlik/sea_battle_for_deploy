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
        // this.create_game_map();
        this.darker = new Phaser.GameObjects.Image(this.scene, 0, 0, 'darkner');
        this.darker.setOrigin(0);
        this.darker.setScale(game_size.width / this.darker.width, game_size.height / this.darker.height);
        this.add(this.darker);
        this.create_interface();
    }
    create_game_map() {
        // this.game_map = new GameMap(this.scene);
        // this.add(this.game_map);
    }
    create_interface() {
        this.profile_container = new Phaser.GameObjects.Container(this.scene, 100, 120);
        this.add(this.profile_container);
        this.ava_frame = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ava_frame');
        this.ava = new Phaser.GameObjects.Image(this.scene, this.ava_frame.x, this.ava_frame.y, 'default_character');
        this.profile_bg = new Phaser.GameObjects.Image(this.scene, this.ava_frame.x + this.ava_frame.width / 2, this.ava_frame.y - this.ava_frame.height / 2, 'profile_bg');
        this.profile_bg.setOrigin(0);
        this.profile_container.add([this.ava_frame, this.profile_bg, this.ava]);
        this.settings_button = new CustomButton(this.scene, {
            x: game_size.width - 20,
            y: this.profile_bg.y + this.profile_container.y,
            frame_out: 'settings_button',
            callback: () => {
                // game_container.windows_manager.show_window('test', {});
                // game_container.windows_manager.show_window('result_battle');
            }
        });
        this.settings_button.setOrigin(1, 0);
        this.add(this.settings_button);
        this.play_button = new CustomButton(this.scene, {
            x: game_size.width - 20,
            y: game_size.height - 20,
            frame_out: 'play_button',
            callback: () => {
                // game_container.update_scenes('game_play');
                game_container.windows_manager.show_window('arena_slider');
            }
        });
        this.play_button.setOrigin(1);
        this.add(this.play_button);
        let text_play = new Phaser.GameObjects.Text(this.scene, 0, 0, 'Play', { fontSize: 48, strokeThickness: 4, stroke: '#70fg09' });
        text_play.setOrigin(0.5);
        this.play_button.add(text_play);
        this.mode_button_container = new Phaser.GameObjects.Container(this.scene, this.play_button.x - (this.play_button.out_img.width / 2 + 20), this.play_button.y + this.play_button.out_img.height / 2);
        this.add(this.mode_button_container);
        this.mode_bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'mode_button');
        this.mode_bg.setOrigin(1);
        this.mode_img = new Phaser.GameObjects.Image(this.scene, -345, -2, 'bot_mode');
        this.mode_img.setOrigin(1);
        this.mode_arrow = new Phaser.GameObjects.Image(this.scene, -50, -70, 'arrow');
        this.mode_arrow.setOrigin(1);
        this.mode_button_container.add([this.mode_bg, this.mode_img, this.mode_arrow]);
    }
}
