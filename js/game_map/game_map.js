class GameMap extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.zoom = 0;
        this.init_interactive();
        this.create_roads();
        // this.create_items();
    }
    init_interactive() {
        this.interactive_shape = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, game_size.width, game_size.height);
        this.setInteractive(this.interactive_shape, Phaser.Geom.Rectangle.Contains);
        this.scene.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event) => {
            if (this.active_map)
                this.update_zoom(pointer, -dy);
        });
        this.scene.input.on('drag', (pointer, dragX, dragY) => {
            if (this.active_map)
                this.update_drag();
        });
    }
    update_drag() {
    }
    update_zoom(pointer, new_zoom) {
        let current_new_zoom = this.zoom + new_zoom / 10;
        if (current_new_zoom >= 10 && current_new_zoom <= 100) {
            this.zoom = current_new_zoom;
            this.scene.tweens.add({
                targets: this,
                x: -pointer.x * this.zoom / 100,
                y: -pointer.y * this.zoom / 100,
                scale: this.zoom / 100 + 1,
                duration: 100
            });
        }
    }
    create_roads() {
        this.bg = new Phaser.GameObjects.Image(this.scene, game_size.width / 2, game_size.height / 2, 'map_bg');
        this.bg.setScale(game_size.height / this.bg.height);
        this.add(this.bg);
    }
    create_items() {
        let items_info = this.scene.cache.json.get('map_items');
        console.log(items_info);
        let item;
        items_info.forEach(item_info => {
            item = new MapItem(this.scene, item_info);
            this.add(item);
        });
    }
}
