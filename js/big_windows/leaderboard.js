class Leaderboard extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_folders_buttons();
        this.create_rating_slider();
        // this.create_avatar_page();
        // this.create_frame_page();
        // this.create_feet_page();
        // this.create_flag_page();
        // this.create_background_page();
        // this.update_visible_page('avatar');
    }
    create_folders_buttons() {
        let cell_width = global_data.cell_width;
        let temp;
        let temp1;
        let text;
        let button;
        temp = new Phaser.GameObjects.Image(this.scene, 11.5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(0.37 * 1.75, 1);
        this.add(temp);
        temp1 = new Phaser.GameObjects.Image(this.scene, 4.5 * cell_width, 5.5 * cell_width, 'new', 'plank');
        temp1.setScale(0.37 * 1.25, 1);
        this.add(temp1);
        this.page_moving = false;
        let up_texts = [];
        let down_texts = [];
        button = new CustomButton(this.scene, {
            x: 11.5 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'avatar' && !this.page_moving) {
                    temp.setScale(0.37 * btn.scaleX, btn.scaleY);
                    temp.setPosition(btn.x, btn.y);
                    up_texts.forEach(d_text => d_text.setStyle({ color: '#051F79' }));
                    up_texts[0].setStyle({ color: '#FFFFFF' });
                }
            }
        });
        button.setScale(1.75, 1);
        text = new Phaser.GameObjects.Text(this.scene, button.x, button.y, 'ONLINE MODE', { fontFamily: 'rubik', fontSize: 28, color: '#FFFFFF' });
        up_texts.push(text);
        text.setOrigin(0.5);
        this.add(text);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 20.5 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'frame' && !this.page_moving) {
                    temp.setScale(0.37 * btn.scaleX, btn.scaleY);
                    temp.setPosition(btn.x, btn.y);
                    up_texts.forEach(d_text => d_text.setStyle({ color: '#051F79' }));
                    up_texts[1].setStyle({ color: '#FFFFFF' });
                }
            }
        });
        button.setScale(1.75, 1);
        text = new Phaser.GameObjects.Text(this.scene, button.x, button.y, 'SINGLE MODE', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        up_texts.push(text);
        text.setOrigin(0.5);
        this.add(text);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 4.5 * cell_width,
            y: 5.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'feet' && !this.page_moving) {
                    temp1.setScale(0.37 * btn.scaleX, btn.scaleY);
                    temp1.setPosition(btn.x, btn.y);
                    down_texts.forEach(d_text => d_text.setStyle({ color: '#051F79' }));
                    down_texts[0].setStyle({ color: '#FFFFFF' });
                }
            }
        });
        button.setScale(1.25, 1);
        text = new Phaser.GameObjects.Text(this.scene, button.x, button.y, 'PER DAY', { fontFamily: 'rubik', fontSize: 28, color: '#FFFFFF' });
        down_texts.push(text);
        text.setOrigin(0.5);
        this.add(text);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 4.5 * cell_width,
            y: 7.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'flag' && !this.page_moving) {
                    temp1.setScale(0.37 * btn.scaleX, btn.scaleY);
                    temp1.setPosition(btn.x, btn.y);
                    down_texts.forEach(d_text => d_text.setStyle({ color: '#051F79' }));
                    down_texts[1].setStyle({ color: '#FFFFFF' });
                }
            }
        });
        button.setScale(1.25, 1);
        text = new Phaser.GameObjects.Text(this.scene, button.x, button.y, 'IN A WEEK', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        down_texts.push(text);
        text.setOrigin(0.5);
        this.add(text);
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 4.5 * cell_width,
            y: 9.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'background' && !this.page_moving) {
                    temp1.setScale(0.37 * btn.scaleX, btn.scaleY);
                    temp1.setPosition(btn.x, btn.y);
                    down_texts.forEach(d_text => d_text.setStyle({ color: '#051F79' }));
                    down_texts[2].setStyle({ color: '#FFFFFF' });
                }
            }
        });
        button.setScale(1.25, 1);
        text = new Phaser.GameObjects.Text(this.scene, button.x, button.y, 'FOR ALL TIME', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        down_texts.push(text);
        text.setOrigin(0.5);
        this.add(text);
        this.add(button);
    }
    create_rating_slider() {
        let cell_width = global_data.cell_width;
        let slider = new SliderBanner(this.scene, {
            width: cell_width * 18,
            height: cell_width * 10
        });
        this.add(slider);
        slider.setXY(16 * cell_width, 10 * cell_width);
        let scroller_yours = new Phaser.GameObjects.Image(this.scene, game_size.width - 2.1 * cell_width, 5 * cell_width, 'new', 'scroller');
        this.add(scroller_yours);
        slider.on('scrollProgress', (val) => {
            scroller_yours.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        let temp_rating = [
            {},
            {},
            {},
            {},
            {},
            {},
        ];
        let temp;
        let x = 8.6 * cell_width;
        let y;
        temp_rating.forEach((ava_id, ava_index) => {
            y = ava_index * cell_width;
            // temp = new Phaser.GameObjects.Image(
            //     this.scene, 
            //     x, 
            //     y, 
            //     'new', 
            //     'profile_ava'
            // );
            temp = new Phaser.GameObjects.Rectangle(this.scene, x, y + 0.5 * cell_width, 18 * cell_width, 7, 0x051F79);
            slider.add_child(temp);
        });
    }
    show() {
    }
    handler_close() {
    }
}
