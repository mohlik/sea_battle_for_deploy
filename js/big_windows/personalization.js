class Personalization extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_folders_buttons();
        this.create_avatar_page();
        this.create_frame_page();
        this.create_feet_page();
        this.create_flag_page();
        this.create_background_page();
        this.update_visible_page('avatar');
    }
    create_folders_buttons() {
        let cell_width = global_data.cell_width;
        let temp;
        let text;
        let button;
        temp = new Phaser.GameObjects.Image(this.scene, 4.5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(0.37, 1);
        this.add(temp);
        button = new CustomButton(this.scene, {
            x: 4.5 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'avatar' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('avatar');
                }
            }
        });
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 9.6 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'frame' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('frame');
                }
            }
        });
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 14.7 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'feet' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('feet');
                }
            }
        });
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 19.8 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'flag' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('flag');
                }
            }
        });
        this.add(button);
        button = new CustomButton(this.scene, {
            x: 25 * cell_width,
            y: 3.5 * cell_width,
            atlas: 'new',
            frame_out: 'plank_frame',
            callback: (btn) => {
                if (this.page_name != 'background' && !this.page_moving) {
                    temp.setPosition(btn.x, btn.y);
                    this.update_visible_page('background');
                }
            }
        });
        this.add(button);
    }
    update_visible_page(name) {
        const conditions = {
            'avatar': this.avatar_page,
            'frame': this.frame_page,
            'feet': this.feet_page,
            'flag': this.flag_page,
            'background': this.background_page,
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
    create_avatar_page() {
        let cell_width = global_data.cell_width;
        this.avatar_page = new Phaser.GameObjects.Container(this.scene);
        this.avatar_page.alpha = 0;
        this.avatar_page.visible = false;
        this.add(this.avatar_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        graphics.lineBetween(game_size.width / 2, 5 * cell_width, game_size.width / 2, 16 * cell_width);
        graphics.lineBetween(game_size.width / 2 - cell_width, 5.5 * cell_width, game_size.width / 2 - cell_width, 15.5 * cell_width);
        graphics.lineBetween(26.5 * cell_width, 5.5 * cell_width, 26.5 * cell_width, 15.5 * cell_width);
        this.avatar_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 4, cell_width * 4.5, 'YOU AVATARS', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width * 0.75, cell_width * 4.5, 'AVATARS', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 4.5 * cell_width, cell_width * 3.5, 'AVATAR', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 9.6 * cell_width, cell_width * 3.5, 'FRAME', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 14.7 * cell_width, cell_width * 3.5, 'FEET', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 19.8 * cell_width, cell_width * 3.5, 'FLAG', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'BATTLEFIELD', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.avatar_page.add(text);
        let slider_yours = new SliderBanner(this.scene, {
            width: cell_width * 11,
            height: cell_width * 11
        });
        this.avatar_page.add(slider_yours);
        slider_yours.setXY(game_size.width / 4, game_size.height / 2 + cell_width * 2.5);
        let scroller_yours = new Phaser.GameObjects.Image(this.scene, game_size.width / 2 - cell_width, 5.5 * cell_width, 'new', 'scroller');
        this.avatar_page.add(scroller_yours);
        slider_yours.on('scrollProgress', (val) => {
            scroller_yours.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        let your_avatars = global_data.user_data.personalization.avatars;
        let temp;
        your_avatars.forEach((ava_id, ava_index) => {
            let x = ava_index % 2 === 0 ? cell_width * 8 : cell_width * 3;
            let y = ava_index % 2 === 0 ? (cell_width * 2.8 * (ava_index - 1)) : (cell_width * 2.8 * (ava_index));
            temp = new Phaser.GameObjects.Image(this.scene, x, y, 'new', 'profile_ava');
            slider_yours.add_child(temp);
            temp.y -= 1.4 * cell_width;
            temp.setInteractive();
            temp.on('pointerdown', () => {
                slider_yours.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_yours.was_move) {
                    this.handler_choose_ava(ava_id);
                }
                else {
                    slider_yours.was_move = false;
                }
                slider_yours.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_yours.pointer_down = false;
                slider_yours.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_yours.emit('pointermove', pointer);
            });
            temp = new Phaser.GameObjects.Image(this.scene, x, y + temp.height / 2, 'new', 'blue_button');
            slider_yours.add_child(temp);
            temp.scale = 0.8;
            temp.y -= 1 * cell_width;
            temp.setInteractive();
            temp.on('pointerdown', () => {
                slider_yours.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_yours.was_move) {
                    this.handler_choose_ava('flag');
                }
                else {
                    slider_yours.was_move = false;
                }
                slider_yours.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_yours.pointer_down = false;
                slider_yours.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_yours.emit('pointermove', pointer);
            });
        });
        //////////////////////////////
        let slider_for_buy = new SliderBanner(this.scene, {
            width: cell_width * 11,
            height: cell_width * 11
        });
        this.avatar_page.add(slider_for_buy);
        slider_for_buy.setXY(cell_width * 20, game_size.height / 2 + cell_width * 2.5);
        let scroller_for_buy = new Phaser.GameObjects.Image(this.scene, 26.5 * cell_width, 5.5 * cell_width, 'new', 'scroller');
        this.avatar_page.add(scroller_for_buy);
        slider_for_buy.on('scrollProgress', (val) => {
            scroller_for_buy.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        your_avatars.forEach((ava_id, ava_index) => {
            let x = ava_index % 2 === 0 ? cell_width * 8 : cell_width * 3;
            let y = ava_index % 2 === 0 ? (cell_width * 2.8 * (ava_index - 1)) : (cell_width * 2.8 * (ava_index));
            temp = new Phaser.GameObjects.Image(this.scene, x, y, 'new', 'profile_ava');
            slider_for_buy.add_child(temp);
            temp.y -= 1.4 * cell_width;
            temp.setInteractive();
            temp.on('pointerdown', () => {
                slider_for_buy.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_for_buy.was_move) {
                    // this.handler_choose_ava(ava_id);
                }
                else {
                    slider_for_buy.was_move = false;
                }
                slider_for_buy.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_for_buy.pointer_down = false;
                slider_for_buy.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_for_buy.emit('pointermove', pointer);
            });
            temp = new Phaser.GameObjects.Image(this.scene, x, y + temp.height / 2, 'new', 'blue_button');
            slider_for_buy.add_child(temp);
            temp.scale = 0.8;
            temp.y -= 1 * cell_width;
            temp.setInteractive();
            temp.on('pointerdown', () => {
                slider_for_buy.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_for_buy.was_move) {
                    this.handler_choose_ava('flag');
                }
                else {
                    slider_for_buy.was_move = false;
                }
                slider_for_buy.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_for_buy.pointer_down = false;
                slider_for_buy.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_for_buy.emit('pointermove', pointer);
            });
        });
    }
    handler_choose_ava(ava_name) {
    }
    create_frame_page() {
        let cell_width = global_data.cell_width;
        this.frame_page = new Phaser.GameObjects.Container(this.scene);
        this.frame_page.alpha = 0;
        this.frame_page.visible = false;
        this.add(this.frame_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        graphics.lineBetween(game_size.width / 2, 5 * cell_width, game_size.width / 2, 16 * cell_width);
        graphics.lineBetween(game_size.width / 2 - cell_width, 5.5 * cell_width, game_size.width / 2 - cell_width, 15.5 * cell_width);
        graphics.lineBetween(26.5 * cell_width, 5.5 * cell_width, 26.5 * cell_width, 15.5 * cell_width);
        this.frame_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 4, cell_width * 4.5, 'YOU FRAMES', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, game_size.width * 0.75, cell_width * 4.5, 'FRAMES', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 4.5 * cell_width, cell_width * 3.5, 'AVATAR', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 9.6 * cell_width, cell_width * 3.5, 'FRAME', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 14.7 * cell_width, cell_width * 3.5, 'FEET', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 19.8 * cell_width, cell_width * 3.5, 'FLAG', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'BATTLEFIELD', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.frame_page.add(text);
        let slider_yours = new SliderBanner(this.scene, {
            width: cell_width * 11,
            height: cell_width * 11
        });
        this.frame_page.add(slider_yours);
        slider_yours.setXY(game_size.width / 4, game_size.height / 2 + cell_width * 2.5);
        let scroller_yours = new Phaser.GameObjects.Image(this.scene, game_size.width / 2 - cell_width, 5.5 * cell_width, 'new', 'scroller');
        this.frame_page.add(scroller_yours);
        slider_yours.on('scrollProgress', (val) => {
            scroller_yours.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        let your_avatars = global_data.user_data.personalization.avatars;
        let temp;
        your_avatars.forEach((ava_id, ava_index) => {
            let x = ava_index % 2 === 0 ? cell_width * 8 : cell_width * 3;
            let y = ava_index % 2 === 0 ? (cell_width * 2.8 * (ava_index - 1)) : (cell_width * 2.8 * (ava_index));
            temp = new Phaser.GameObjects.Image(this.scene, x, y, 'new', 'profile_ava');
            slider_yours.add_child(temp);
            temp.y -= 1.4 * cell_width;
            temp.setInteractive();
            temp.on('pointerdown', () => {
                slider_yours.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_yours.was_move) {
                    this.handler_choose_ava(ava_id);
                }
                else {
                    slider_yours.was_move = false;
                }
                slider_yours.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_yours.pointer_down = false;
                slider_yours.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_yours.emit('pointermove', pointer);
            });
        });
        //////////////////////////////
        let slider_for_buy = new SliderBanner(this.scene, {
            width: cell_width * 11,
            height: cell_width * 11
        });
        this.frame_page.add(slider_for_buy);
        slider_for_buy.setXY(cell_width * 20, game_size.height / 2 + cell_width * 2.5);
        let scroller_for_buy = new Phaser.GameObjects.Image(this.scene, 26.5 * cell_width, 5.5 * cell_width, 'new', 'scroller');
        this.frame_page.add(scroller_for_buy);
        slider_for_buy.on('scrollProgress', (val) => {
            scroller_for_buy.y = 5.5 * cell_width + ((1 - val) * 10 * cell_width);
        });
        your_avatars.forEach((ava_id, ava_index) => {
            let x = ava_index % 2 === 0 ? cell_width * 8 : cell_width * 3;
            let y = ava_index % 2 === 0 ? (cell_width * 2.8 * (ava_index - 1)) : (cell_width * 2.8 * (ava_index));
            temp = new Phaser.GameObjects.Image(this.scene, x, y, 'new', 'profile_ava');
            slider_for_buy.add_child(temp);
            temp.y -= 1.4 * cell_width;
            temp.setInteractive();
            temp.on('pointerdown', () => {
                slider_for_buy.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_for_buy.was_move) {
                    this.handler_choose_ava(ava_id);
                }
                else {
                    slider_for_buy.was_move = false;
                }
                slider_for_buy.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_for_buy.pointer_down = false;
                slider_for_buy.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_for_buy.emit('pointermove', pointer);
            });
        });
    }
    create_feet_page() {
        let cell_width = global_data.cell_width;
        this.feet_page = new Phaser.GameObjects.Container(this.scene);
        this.feet_page.alpha = 0;
        this.feet_page.visible = false;
        this.add(this.feet_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        this.feet_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 4.5, 'CHOISE FEET!', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.feet_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 4.5 * cell_width, cell_width * 3.5, 'AVATAR', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.feet_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 9.6 * cell_width, cell_width * 3.5, 'FRAME', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.feet_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 14.7 * cell_width, cell_width * 3.5, 'FEET', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.feet_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 19.8 * cell_width, cell_width * 3.5, 'FLAG', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.feet_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'BATTLEFIELD', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.feet_page.add(text);
    }
    create_flag_page() {
        let cell_width = global_data.cell_width;
        this.flag_page = new Phaser.GameObjects.Container(this.scene);
        this.flag_page.alpha = 0;
        this.flag_page.visible = false;
        this.add(this.flag_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        graphics.lineBetween(26.5 * cell_width, 5.5 * cell_width, 26.5 * cell_width, 15.5 * cell_width);
        this.flag_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 4.5, 'CHOISE FLAG!', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.flag_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 4.5 * cell_width, cell_width * 3.5, 'AVATAR', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.flag_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 9.6 * cell_width, cell_width * 3.5, 'FRAME', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.flag_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 14.7 * cell_width, cell_width * 3.5, 'FEET', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.flag_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 19.8 * cell_width, cell_width * 3.5, 'FLAG', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.flag_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'BATTLEFIELD', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.flag_page.add(text);
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
        let your_avatars = global_data.user_data.personalization.avatars;
        global_data['flags'].forEach((flag_name, flag_index) => {
            let x = (flag_index % 5) * cell_width * 4.5 + cell_width * 2;
            let y = Math.floor(flag_index / 5) * cell_width * 5 + cell_width * 1.5;
            let temp = new Phaser.GameObjects.Image(this.scene, x, y, 'default_frame');
            slider_yours.add_child(temp);
            temp.setInteractive();
            let flag = new Phaser.GameObjects.Image(this.scene, x, y, 'flags', flag_name);
            flag.setScale(0.3);
            slider_yours.add_child(flag);
            temp.on('pointerdown', () => {
                slider_yours.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_yours.was_move) {
                    // this.handler_choose_ava('flag');
                }
                else {
                    slider_yours.was_move = false;
                }
                slider_yours.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_yours.pointer_down = false;
                slider_yours.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_yours.emit('pointermove', pointer);
            });
            temp = new Phaser.GameObjects.Image(this.scene, x, y + temp.height / 2 + 0.4 * cell_width, 'new', flag_name !== global_data['user_data']['flag'] ? 'lightblue_button' : 'blue_button');
            // temp.alpha = 0.7;
            temp.scale = 0.8;
            temp.setInteractive();
            slider_yours.add_child(temp);
            if (true) { //flag_name !== global_data['user_data']['flag']) {
                text = new Phaser.GameObjects.Text(this.scene, temp.x, temp.y, 'CHOOSE', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
                text.setOrigin(0.5);
                slider_yours.add_child(text);
                temp['text'] = text;
            }
            temp.on('pointerdown', () => {
                slider_yours.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!slider_yours.was_move) {
                    if (flag_name !== global_data['user_data']['flag']) {
                        temp['text'].destroy();
                        temp.setFrame('blue_button');
                        global_data['user_data'].flag = flag.frame.name;
                    }
                }
                else {
                    slider_yours.was_move = false;
                }
                slider_yours.pointer_down = false;
            });
            temp.on('pointerout', () => {
                slider_yours.pointer_down = false;
                slider_yours.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                slider_yours.emit('pointermove', pointer);
            });
        });
    }
    create_background_page() {
        let cell_width = global_data.cell_width;
        this.background_page = new Phaser.GameObjects.Container(this.scene);
        this.background_page.alpha = 0;
        this.background_page.visible = false;
        this.add(this.background_page);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(0, 5 * cell_width, game_size.width, 5 * cell_width);
        this.background_page.add(graphics);
        let text;
        text = new Phaser.GameObjects.Text(this.scene, game_size.width / 2, cell_width * 4.5, 'CHOISE BATTLEFIELD!', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.background_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 4.5 * cell_width, cell_width * 3.5, 'AVATAR', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.background_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 9.6 * cell_width, cell_width * 3.5, 'FRAME', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.background_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 14.7 * cell_width, cell_width * 3.5, 'FEET', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.background_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 19.8 * cell_width, cell_width * 3.5, 'FLAG', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        this.background_page.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 25 * cell_width, cell_width * 3.5, 'BATTLEFIELD', { fontFamily: 'rubik', fontSize: 36, color: '#FFFFFF' });
        text.setOrigin(0.5);
        this.background_page.add(text);
    }
    show() {
    }
    handler_close() {
    }
}
