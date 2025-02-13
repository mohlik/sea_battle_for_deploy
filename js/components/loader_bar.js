class LoaderBar extends Phaser.GameObjects.Container {
    constructor(scene, config) {
        super(scene);
        this.init(config);
    }
    init(config) {
        let { atlas, frame_bg, frame_bar } = config;
        if (frame_bg) {
            this.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_bg, atlas ? frame_bg : null);
            this.add(this.bg);
        }
        this.bar = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_bar, atlas ? frame_bar : null);
        this.add(this.bar);
        this.update_progress(0);
    }
    update_progress(value) {
        this.bar.setCrop(0, 0, value * this.bar.width, this.bar.height);
    }
}
