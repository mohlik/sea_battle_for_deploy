class GameMap extends Phaser.GameObjects.Container {
    interactive_shape: Phaser.GameObjects.Rectangle
    zoom: number

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.init();
    }

    init(): void {
        this.zoom = 0;
        this.init_interactive();
        this.create_roads();
        this.create_items();
    }

    init_interactive(): void {
        this.interactive_shape = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, game_size.width, game_size.height);

        this.setInteractive(
            this.interactive_shape,
            Phaser.Geom.Rectangle.Contains
        );

        this.scene.input.on('wheel', (pointer, currentlyOver, dx, dy, dz, event)=>{ 
			this.update_zoom(pointer, -dy);
		});
    }

    update_zoom(pointer, new_zoom: number): void {
        let current_new_zoom: number = this.zoom + new_zoom / 10;
        if(current_new_zoom >= 10 && current_new_zoom <= 100) {
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

    create_roads(): void {

    }

    create_items(): void {
        let items_info = this.scene.cache.json.get('map_items');
        console.log(items_info);
        let item: MapItem;

        items_info.forEach(item_info => {
            item = new MapItem(this.scene, item_info);
            this.add(item);
        });
    }
}