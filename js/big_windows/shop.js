class Shop extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_folders_buttons();
        this.create_free_page();
        this.create_coins_page();
        this.create_gems_page();
        this.create_promotion_page();
        this.update_visible_page('free');
    }
    create_folders_buttons() {
        let cell_width = global_data.cell_width;
        let temp;
        let text;
        let button;
        temp = new Phaser.GameObjects.Image(this.scene, 5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(5 / 11, 1);
        this.add(temp);
        button = new CustomButton(this.scene, {
            x: 5 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'avatar' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('free');
                }
            }
        });
        button.setScale(1.2, 1);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 11.5 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'frame' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('coins');
                }
            }
        });
        button.setScale(1.2, 1);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 18.5 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'feet' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('gems');
                }
            }
        });
        button.setScale(1.2, 1);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 25 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'flag' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('promotion');
                }
            }
        });
        button.setScale(1.2, 1);
        this.add(button);
    }
    update_visible_page(name) {
        const conditions = {
            'free': this.free_page,
            'coins': this.coins_page,
            'gems': this.gems_page,
            'promotion': this.promotion_page
        };
        this.page_moving = true;
        if (this.current_page) {
            this.scene.tweens.add({
                targets: this.current_page,
                alpha: 0,
                duration: 150,
                onComplete: () => {
                    this.current_page.visible = false;
                    this.page_name = name;
                    this.current_page = conditions[this.page_name];
                    this.current_page.visible = true;
                    this.scene.tweens.add({
                        targets: this.current_page,
                        alpha: 1,
                        duration: 150,
                        onComplete: () => {
                            this.page_moving = false;
                        }
                    });
                }
            });
        }
        else {
            this.page_name = name;
            this.current_page = conditions[this.page_name];
            this.current_page.visible = true;
            this.scene.tweens.add({
                targets: this.current_page,
                alpha: 1,
                duration: 200,
                onComplete: () => {
                    this.page_moving = false;
                }
            });
        }
    }
    create_free_page() {
        let cell_width = global_data.cell_width;
        this.free_page = new Phaser.GameObjects.Container(this.scene);
        this.free_page.alpha = 0;
        this.free_page.visible = false;
        this.add(this.free_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        this.free_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, 5 * cell_width, cell_width * 3.5, 'FREE', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.free_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 11.5 * cell_width, cell_width * 3.5, 'COINS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.free_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 18.5 * cell_width, cell_width * 3.5, 'GEMS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.free_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'PROMOTIONS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.free_page.add(text);
    }
    handler_choose_ava(ava_name) {
    }
    create_coins_page() {
        let cell_width = global_data.cell_width;
        this.coins_page = new Phaser.GameObjects.Container(this.scene);
        this.coins_page.alpha = 0;
        this.coins_page.visible = false;
        this.add(this.coins_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        // graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        this.coins_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, 5 * cell_width, cell_width * 3.5, 'FREE', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.coins_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 11.5 * cell_width, cell_width * 3.5, 'COINS', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.coins_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 18.5 * cell_width, cell_width * 3.5, 'GEMS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.coins_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'PROMOTIONS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.coins_page.add(text);
        let slider_container = new Phaser.GameObjects.Container(this.scene);
        this.coins_page.add(slider_container);
        let i = 0;
        global_data.shop.purchase_items.forEach((purchase_item) => {
            if (purchase_item.type === 'coins') {
                let temp;
                let text;
                let container_item = new Phaser.GameObjects.Container(this.scene, 4 * cell_width + i * cell_width * 7, 8.5 * cell_width);
                let graphics = new Phaser.GameObjects.Graphics(this.scene);
                graphics.lineStyle(6, 0x072279, 1);
                graphics.strokeRect(cell_width * -3 + 3, cell_width * -2.5 + 3, cell_width * 6 - 3, cell_width * 6 - 3);
                container_item.add(graphics);
                temp = new Phaser.GameObjects.Image(this.scene, 1, -3 * cell_width, 'new', 'plank');
                temp.setScale(6 / 11 + 0.015, 1);
                container_item.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, 1, -3 * cell_width, 'COINS PACK', { fontFamily: 'rubik', fontSize: 28 });
                text.setOrigin(0.5);
                container_item.add(text);
                temp = new Phaser.GameObjects.Image(this.scene, 0, -0.5 * cell_width, 'shop', purchase_item.icon);
                if (temp.height > 3 * cell_width)
                    temp.setScale((3 * cell_width) / temp.height);
                container_item.add(temp);
                temp = new Phaser.GameObjects.Image(this.scene, 1, 2 * cell_width, 'new', 'plank');
                temp.setScale(4 / 11, 1);
                container_item.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, 1, 2 * cell_width, String(purchase_item.items.money), { fontFamily: 'rubik', fontSize: 36 });
                text.setOrigin(0.5);
                container_item.add(text);
                temp = new Phaser.GameObjects.Image(this.scene, 0, 4 * cell_width, 'new', 'purple_button');
                container_item.add(temp);
                temp.setInteractive();
                temp.on('pointerup', () => {
                });
                text = new Phaser.GameObjects.Text(this.scene, 0, 4 * cell_width, String(purchase_item.price), { fontFamily: 'rubik', fontSize: 36 });
                text.setOrigin(0.5);
                container_item.add(text);
                slider_container.add(container_item);
                i++;
            }
        });
    }
    create_gems_page() {
        let cell_width = global_data.cell_width;
        this.gems_page = new Phaser.GameObjects.Container(this.scene);
        this.gems_page.alpha = 0;
        this.gems_page.visible = false;
        this.add(this.gems_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        // graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        this.gems_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, 5 * cell_width, cell_width * 3.5, 'FREE', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.gems_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 11.5 * cell_width, cell_width * 3.5, 'COINS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.gems_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 18.5 * cell_width, cell_width * 3.5, 'GEMS', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.gems_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'PROMOTIONS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.gems_page.add(text);
        let slider_container = new Phaser.GameObjects.Container(this.scene);
        this.gems_page.add(slider_container);
        let i = 0;
        global_data.shop.purchase_items.forEach((purchase_item) => {
            if (purchase_item.type === 'gems') {
                let temp;
                let text;
                let container_item = new Phaser.GameObjects.Container(this.scene, 4 * cell_width + i * cell_width * 7, 8.5 * cell_width);
                let graphics = new Phaser.GameObjects.Graphics(this.scene);
                graphics.lineStyle(6, 0x072279, 1);
                graphics.strokeRect(cell_width * -3 + 3, cell_width * -2.5 + 3, cell_width * 6 - 3, cell_width * 6 - 3);
                container_item.add(graphics);
                temp = new Phaser.GameObjects.Image(this.scene, 1, -3 * cell_width, 'new', 'plank');
                temp.setScale(6 / 11 + 0.015, 1);
                container_item.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, 1, -3 * cell_width, 'COINS PACK', { fontFamily: 'rubik', fontSize: 28 });
                text.setOrigin(0.5);
                container_item.add(text);
                temp = new Phaser.GameObjects.Image(this.scene, 0, -0.5 * cell_width, 'shop', purchase_item.icon);
                if (temp.height > 3 * cell_width)
                    temp.setScale((3 * cell_width) / temp.height);
                container_item.add(temp);
                temp = new Phaser.GameObjects.Image(this.scene, 1, 2 * cell_width, 'new', 'plank');
                temp.setScale(4 / 11, 1);
                container_item.add(temp);
                text = new Phaser.GameObjects.Text(this.scene, 1, 2 * cell_width, String(purchase_item.items.gems), { fontFamily: 'rubik', fontSize: 36 });
                text.setOrigin(0.5);
                container_item.add(text);
                temp = new Phaser.GameObjects.Image(this.scene, 0, 4 * cell_width, 'new', 'purple_button');
                container_item.add(temp);
                temp.setInteractive();
                temp.on('pointerup', () => {
                });
                text = new Phaser.GameObjects.Text(this.scene, 0, 4 * cell_width, String(purchase_item.price), { fontFamily: 'rubik', fontSize: 36 });
                text.setOrigin(0.5);
                container_item.add(text);
                slider_container.add(container_item);
                i++;
            }
        });
    }
    create_promotion_page() {
        let cell_width = global_data.cell_width;
        this.promotion_page = new Phaser.GameObjects.Container(this.scene);
        this.promotion_page.alpha = 0;
        this.promotion_page.visible = false;
        this.add(this.promotion_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        this.promotion_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, 5 * cell_width, cell_width * 3.5, 'FREE', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.promotion_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 11.5 * cell_width, cell_width * 3.5, 'COINS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.promotion_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 18.5 * cell_width, cell_width * 3.5, 'GEMS', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.promotion_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'PROMOTIONS', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.promotion_page.add(text);
    }
    show() {
    }
    handler_close() {
    }
}
