class Achivments extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_folders_buttons();
        this.create_flag_page();
    }
    create_folders_buttons() {
        let cell_width = global_data.cell_width;
        let temp;
        let text;
        let button;
        temp = new Phaser.GameObjects.Image(this.scene, game_size.width / 2, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(2.8, 1);
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, 3.5 * cell_width, 'ACHIVMENTS', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.add(text);
    }
    create_flag_page() {
        let cell_width = global_data.cell_width;
        this.flag_page = new Phaser.GameObjects.Container(this.scene);
        this.add(this.flag_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        graphics.lineBetween(26.5 * cell_width, 5.5 * cell_width, 26.5 * cell_width, 15.5 * cell_width);
        this.flag_page.add(graphics);
        let text;
        let slider_yours = new SliderBanner(this.scene, {
            width: cell_width * 24,
            height: cell_width * 11
        });
        this.flag_page.add(slider_yours);
        slider_yours.setXY(game_size.width / 2, game_size.height / 2 + cell_width * 2.5);
        let scroller_yours = new Phaser.GameObjects.Image(this.scene, 26.5 * cell_width, 5.5 * cell_width, 'new', 'scroller');
        this.flag_page.add(scroller_yours);
        slider_yours.on('scrollProgress', (val) => {
            scroller_yours.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        let temp;
        for (let i = 0; i < 16; i++) {
            let x = (i % 4) * cell_width * 5.5 + cell_width * 2;
            let y = Math.floor(i / 4) * cell_width * 9 + cell_width * 4;
            temp = new Phaser.GameObjects.Rectangle(this.scene, x, y, 5 * cell_width, 8 * cell_width, 0x000000, 0);
            temp.setStrokeStyle(5, 0x051F79, 1);
            slider_yours.add_child(temp);
            temp = new Phaser.GameObjects.Image(this.scene, x, y - 3.5 * cell_width, 'new', 'plank');
            temp.setScale(0.46, 1);
            slider_yours.add_child(temp);
            temp = new Phaser.GameObjects.Image(this.scene, x, y - 0.5 * cell_width, 'medal');
            slider_yours.add_child(temp);
            temp = new LoaderBar(this.scene, {
                atlas: 'new',
                frame_bg: 'plank',
                frame_bar: 'oil_progress'
            });
            temp.bg.setScale(0.73, 1);
            temp.update_progress(Math.random());
            temp.setPosition(x, y + 3 * cell_width);
            temp.setScale(0.55, 1);
            slider_yours.add_child(temp);
            temp = new Phaser.GameObjects.Text(this.scene, x, y - 3.5 * cell_width, 'ACHIVMENT NAME', {
                fontFamily: 'rubik',
                fontSize: 28,
                color: '#FFFFFF'
            });
            temp.setOrigin(0.5);
            slider_yours.add_child(temp);
            temp = new Phaser.GameObjects.Text(this.scene, x, y + 1.7 * cell_width, 'Sink single-deck ships\nwithout failures', {
                fontFamily: 'rubik',
                fontSize: 24,
                color: '#051F79',
                align: 'center'
            });
            temp.setOrigin(0.5);
            slider_yours.add_child(temp);
        }
    }
    show() {
    }
    handler_close() {
    }
}
