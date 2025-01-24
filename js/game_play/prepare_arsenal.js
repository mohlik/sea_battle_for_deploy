class PrepareArsenal extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.name = 'prepare_field';
        this.init(params);
    }
    show(params = {}) {
        this.ships = global_data.game_play.fields[0].ships;
        this.fill_ships(global_data.cell_width);
    }
    create_bar() {
        let cell_width = global_data.cell_width;
        let temp = new Phaser.GameObjects.Image(this.scene, 17.5 * cell_width, 3.5 * cell_width, 'game_play', 'oil_icon');
        this.oil_bar = new LoaderBar(this.scene, {
            atlas: 'new',
            // frame_bg: 'plank',
            frame_bar: 'oil_progress'
        });
        this.oil_bar.setPosition(22 * cell_width, 3.5 * cell_width);
        this.oil_bar.scaleX = 1.02;
        this.dot_oil_button = new CustomButton(this.scene, {
            x: cell_width * 26.5,
            y: cell_width * 3.5,
            atlas: 'new',
            frame_out: 'button_plus',
            callback: () => {
                global_data.user_data.oil.amount = global_data.user_data.oil.max;
                this.update_oil();
            }
        });
        this.oil_txt = new Phaser.GameObjects.Text(this.scene, this.oil_bar.x, this.oil_bar.y, '', { fontSize: 24, strokeThickness: 4, stroke: '#70fg09' });
        this.oil_txt.setOrigin(0.5);
        this.update_oil();
        this.add([temp, this.oil_bar, this.dot_oil_button, this.oil_txt]);
    }
    update_oil() {
        this.oil_bar.update_progress(global_data.user_data.oil.amount /
            global_data.user_data.oil.max);
        this.oil_txt.text = `${global_data.user_data.oil.amount} / ${global_data.user_data.oil.max}`;
    }
    create_arsenal() {
        let cell_width = global_data.cell_width;
        this.arsenal_slider = new SliderBanner(this.scene, {
            // background: {
            //     frame: 'arsenal_slider'
            // },
            width: cell_width * 11,
            height: cell_width * 9
        });
        this.arsenal_slider.setXY(22.15 * cell_width, 8.45 * cell_width);
        this.add(this.arsenal_slider);
        this.skill_txts = {};
        let temp;
        [
            'atom',
            'bomber',
            'torpedo',
            'fighter',
            // 'airdef',
            // 'submarine',
            'radar',
            // 'mine'
        ].forEach((skill_name, i) => {
            temp = new Phaser.GameObjects.Image(this.scene, cell_width * 4.6, i * cell_width * 4 + 1.8 * cell_width, 'skill_item');
            this.arsenal_slider.add_child(temp);
            temp.setInteractive(
            // {draggable: true}
            );
            // let for_click = true;
            // temp.on('pointerup', () => {
            //     if(for_click) this.handler_buy(skill_name);
            //     else for_click = true;
            // });
            // temp.on('drag', (pointer, dragX, dragY) => {
            //     for_click = false;
            //     this.arsenal_slider.emit('drag', pointer, dragX, dragY);
            // });
            temp.on('pointerdown', () => {
                this.arsenal_slider.pointer_down = true;
            });
            temp.on('pointerup', () => {
                if (!this.arsenal_slider.was_move) {
                    this.handler_buy(skill_name);
                }
                else {
                    this.arsenal_slider.was_move = false;
                }
                this.arsenal_slider.pointer_down = false;
            });
            temp.on('pointerout', () => {
                this.arsenal_slider.pointer_down = false;
                this.arsenal_slider.was_move = false;
            });
            temp.on('pointermove', (pointer) => {
                this.arsenal_slider.emit('pointermove', pointer);
            });
            temp = new Phaser.GameObjects.Image(this.scene, temp.x, temp.y + 25, 'skill_' + skill_name);
            this.arsenal_slider.add_child(temp);
            temp = new Phaser.GameObjects.Text(this.scene, temp.x - 230, temp.y + 50, `${global_data.user_data.skills[skill_name].amount}/${global_data.skills[skill_name].max}`, {
                fontFamily: 'rubik',
                fontSize: 36,
                color: '#072279',
            });
            temp.setOrigin(0.5, 0.5);
            this.arsenal_slider.add_child(temp);
            this.skill_txts[skill_name] = temp;
            temp = new Phaser.GameObjects.Text(this.scene, temp.x + 460, temp.y, `${global_data.skills[skill_name].price}`, {
                fontFamily: 'rubik',
                fontSize: 36,
                color: '#072279',
            });
            temp.setOrigin(0.5);
            this.arsenal_slider.add_child(temp);
            temp = new Phaser.GameObjects.Image(this.scene, temp.x - 80, temp.y, 'oil_can');
            temp.scale = 0.7;
            this.arsenal_slider.add_child(temp);
        });
        // temp = new Phaser.GameObjects.Image(this.scene, 20 * cell_width, 3 * cell_width, 'plank');
        // this.add(temp);
    }
    handler_buy(skill_name) {
        let user_skills = global_data.user_data.skills;
        let data_skills = global_data.skills;
        let user_oil = global_data.user_data.oil;
        let price = data_skills[skill_name].price;
        if (user_skills[skill_name].amount + 1 <= data_skills[skill_name].max && user_oil.amount >= price) {
            // request
            user_oil.amount -= price;
            user_skills[skill_name].amount++;
        }
        this.update_skill_amount(skill_name);
        this.update_oil();
    }
    update_skill_amount(skill_name) {
        this.skill_txts[skill_name].text = `${global_data.user_data.skills[skill_name].amount}/${global_data.skills[skill_name].max}`;
    }
    fill_ships(cell_width) {
        let ship;
        let vertical;
        let cells_ships = [];
        this.ships.forEach((ship_data, i) => {
            vertical = ship_data.y_l > ship_data.x_l;
            ship = new Phaser.GameObjects.Image(this.scene, cell_width / 2 + (ship_data.x * cell_width) + 3 * cell_width, cell_width / 2 + (ship_data.y * cell_width) + 5 * cell_width, 'ship_' + (vertical ? ship_data.y_l + 1 : ship_data.x_l + 1));
            ship.scale = (cell_width * (vertical ? ship_data.y_l + 1 : ship_data.x_l + 1)) / ship.width;
            ship.setOrigin((cell_width / 2) / (ship.width * ship.scale), 0.5);
            ship.setAngle(vertical ? 90 : 0);
            this.add(ship);
        });
    }
    update_buttons() {
    }
    create_buttons(game_scale, cell_width) {
        let temp;
        let text;
        this.video_button = new CustomButton(this.scene, {
            x: cell_width * 15,
            y: cell_width * 11 + 7,
            atlas: 'game_play',
            frame_out: 'mini_button',
            callback: () => {
            }
        });
        temp = new Phaser.GameObjects.Image(this.scene, -5, -17, 'new', 'oil_icon_dark');
        this.video_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, '+600', { fontFamily: 'rubik', fontSize: 30, color: '#2BFF2B' });
        text.setOrigin(0.5);
        this.video_button.add(text);
        this.add(this.video_button);
        this.video_button.alpha = 0.7;
        this.restart_button = new CustomButton(this.scene, {
            x: cell_width * 15,
            y: cell_width * 14 + 7,
            atlas: 'game_play',
            frame_out: 'mini_button',
            callback: () => {
                global_data.user_data.oil.amount = global_data.user_data.oil.max;
                this.update_oil();
                Object.keys(global_data.user_data.skills).forEach(skill_name => {
                    global_data.user_data.skills[skill_name].amount = 0;
                    this.update_skill_amount(skill_name);
                });
            }
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'game_play', 'rotate_icon');
        this.restart_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'AUTO', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.restart_button.add(text);
        this.add(this.restart_button);
        this.play_button = new CustomButton(this.scene, {
            x: cell_width * 16 + 6 * cell_width,
            y: cell_width * 14,
            frame_out: 'next_play_button',
            callback: () => {
                game_container.game_play.update_scenes('game_play');
            }
        });
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'BATTLE', { fontFamily: 'rubik', fontSize: 64 });
        text.setOrigin(0.5);
        this.play_button.add(text);
        // this.play_button.scale = 0.7;
        this.add(this.play_button);
    }
    init(params) {
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale;
        let temp = new Phaser.GameObjects.Image(this.scene, cell_width * 8, cell_width * 3.5 + 2, 'new', 'plank');
        temp.scale = cell_width * 10 / temp.width;
        this.add(temp);
        let text = new Phaser.GameObjects.Text(this.scene, cell_width * 8, cell_width * 3.5 + 2, 'SEA MAP', { fontFamily: 'rubik', fontSize: 36 });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 22, cell_width * 3.5 + 2, 'new', 'plank');
        temp.scale = cell_width * 10 / temp.width;
        this.add(temp);
        this.create_field(cell_width);
        this.create_bar();
        this.create_arsenal();
        this.create_buttons(game_scale, cell_width);
    }
    handler_close() {
    }
    create_field(cell_width) {
        let temp;
        this.field_frame = new Phaser.GameObjects.Graphics(this.scene);
        this.field_frame.fillStyle(0xFFFFFF, 0);
        let x = cell_width * 3;
        let y = cell_width * 3.5;
        let width = cell_width * 10;
        let height = cell_width * 10;
        this.field_frame.fillRect(x, y, width, height);
        this.add(this.field_frame);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 8, cell_width * 10, 'new', 'field_frame');
        temp.setScale(1.02);
        this.add(temp);
        let text;
        [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J'
        ].forEach((letter, i) => {
            text = new Phaser.GameObjects.Text(this.scene, 2.5 * cell_width, 5.5 * cell_width + cell_width * i, letter, {
                fontFamily: 'rubik',
                fontSize: 36,
                color: '#051F79'
            });
            text.setOrigin(0.5);
            this.add(text);
            text = new Phaser.GameObjects.Text(this.scene, 3.5 * cell_width + cell_width * i, 4.5 * cell_width, i.toString(), {
                fontFamily: 'rubik',
                fontSize: 36,
                color: '#051F79'
            });
            text.setOrigin(0.5);
            this.add(text);
        });
    }
}
