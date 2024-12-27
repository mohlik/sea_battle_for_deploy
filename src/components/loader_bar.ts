class LoaderBar extends Phaser.GameObjects.Container {
    bg: Phaser.GameObjects.Image
    bar: Phaser.GameObjects.Image
    
    constructor(scene: Phaser.Scene, config: LoaderBarConfig) {
        super(scene);
        this.init(config);
    }

    init(config: LoaderBarConfig): void {
        let {
            atlas,
            frame_bg,
            frame_bar
        } = config;

        this.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_bg, atlas ? frame_bg : null);
        this.bar = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : frame_bar, atlas ? frame_bar : null);
        this.add([this.bg, this.bar]);
        this.update_progress(0);
    }

    update_progress(value:number): void {
        this.bar.setCrop(0, 0, value * this.bar.width, this.bar.height);
    }
}