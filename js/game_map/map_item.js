class MapItem extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }
    init(params) {
        let { atlas, broke_frame, live_frame } = params;
        this.x = params.pos.x;
        this.y = params.pos.y;
        if (params.scale)
            this.scale = params.scale;
        this.broke_image = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : broke_frame, atlas ? broke_frame : null);
        this.live_image = new Phaser.GameObjects.Image(this.scene, 0, 0, atlas ? atlas : live_frame, atlas ? live_frame : null);
        this.add([this.broke_image, this.live_image]);
        this.state_live = false;
        this.update_living();
    }
    update_living() {
        this.broke_image.visible = !this.state_live;
        this.live_image.visible = this.state_live;
    }
}
