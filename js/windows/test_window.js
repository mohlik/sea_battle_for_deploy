class BasicWindow extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
    }
    init() {
        this.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, 'basic_window_bg');
        this.add(this.bg);
        this.close_button = new CustomButton(this.scene, {
            x: game_size.width / 2 - 200,
            y: 100,
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
