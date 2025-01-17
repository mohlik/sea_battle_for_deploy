class QuitBattleWindow extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    create_dark() {
        this.dark = new Phaser.GameObjects.Graphics(this.scene);
        this.dark.fillStyle(0x23232F, 0.6);
        this.dark.fillRect(0, 0, game_size.width, game_size.height);
        this.dark.setInteractive();
        this.dark.on('pointerup', this.handler_close);
    }
    create_bg() {
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0x23232F, 0.6);
        this.bg.fillRect(0, 0, game_size.width, game_size.height);
        this.bg.setInteractive();
    }
    init() {
        // this.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'basic_window_bg');
        // this.add(this.bg);
        this.close_button = new CustomButton(this.scene, {
            x: game_size.width / 2 - 200,
            y: 100,
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
    }
}
