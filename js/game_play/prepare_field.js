class PrepareField extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.name = 'prepare_field';
        this.init(params);
    }
    show(params = {}) {
        this.clear_ships();
        this.prepare_frame.clear();
        this.update_buttons();
    }
    create_drop_zone(game_scale, cell_width) {
        this.drop_zone = {
            x: cell_width * 3,
            y: cell_width * 5,
            width: cell_width * 10,
            height: cell_width * 10
        };
    }
    clear_fantoms() {
        if (this.fantoms)
            this.fantoms.forEach(fantom => {
                fantom.visible = false;
                fantom.setPosition(0, 0);
            });
    }
    clear_ships() {
        if (this.ships) {
            this.ships.forEach(ship => {
                ship.destroy();
            });
            this.ships = [];
        }
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale;
        this.create_ships(game_scale, cell_width);
    }
    create_fantoms_ships(game_scale, cell_width) {
        this.fantoms_true = [
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_1_green').setScale(game_scale),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_2_green').setScale(game_scale),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_3_green').setScale(game_scale),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_4_green').setScale(game_scale),
        ];
        this.fantoms_false = [
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_1_red').setScale(game_scale),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_2_red').setScale(game_scale),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_3_red').setScale(game_scale),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'ship_4_red').setScale(game_scale),
        ];
        this.fantoms = [...this.fantoms_true, ...this.fantoms_false];
        this.fantoms_of_color = {
            '_green': this.fantoms_true,
            '_red': this.fantoms_false
        };
        this.fantoms.forEach(fantom => {
            fantom.setOrigin((cell_width / 2) / (fantom.width * fantom.scale), 0.5);
            fantom.visible = false;
        });
        this.add(this.fantoms);
    }
    is_in_dropzone(x, y) {
        return x > this.drop_zone.x && x < this.drop_zone.x + this.drop_zone.width &&
            y > this.drop_zone.y && y < this.drop_zone.y + this.drop_zone.height;
    }
    catch_stand(object) {
        object.setOrigin(0, 1);
        object.vertical = false;
        object.setAngle(0);
        object.stand = false;
        this.last_ship = null;
        object.x = object.stand_coords.x;
        object.y = object.stand_coords.y;
        this.update_buttons();
    }
    set_drag_interactive(object, game_scale, cell_width) {
        let pointer_start = { x: 0, y: 0 };
        let move_pos = { x: 0, y: 0 };
        let end_pos = { x: object.x + cell_width / 2, y: object.y - cell_width / 2 };
        let index_pos = { x: 0, y: 0 };
        object.stand_coords = { x: object.x, y: object.y };
        object.setInteractive({ draggable: true });
        let start_drag = false;
        object.on('pointerdown', (pointer, localX, localY) => {
            start_drag = false;
            if (object.stand)
                this.last_ship = object;
            pointer_start.x = localX;
            pointer_start.y = localY;
        });
        object.on('pointerup', () => {
            if (!start_drag && this.is_rotate_ship())
                this.rotate_ship();
        });
        object.on('dragstart', (pointer, dragX, dragY) => {
            this.clear_fantoms();
            if (object.stand) {
                this.prepare_frame.remove_ship({
                    x: object.index_pos.x,
                    y: object.index_pos.y,
                    x_l: !object.vertical ? object.index : 0,
                    y_l: object.vertical ? object.index : 0,
                });
            }
            this.update_buttons();
        });
        object.on('drag', (pointer, dragX, dragY) => {
            start_drag = true;
            this.clear_fantoms();
            move_pos.x = pointer.worldX - pointer_start.x + (object.stand ? cell_width / 2 : 0);
            move_pos.y = pointer.worldY + pointer_start.y - (object.stand ? cell_width / 2 : 0);
            object.setPosition(move_pos.x, move_pos.y);
            end_pos = { x: object.x + (!object.stand ? cell_width / 2 : 0), y: object.y - (!object.stand ? cell_width / 2 : 0) };
            this.prepare_frame.update_field();
            if (this.is_in_dropzone(end_pos.x, end_pos.y)) {
                index_pos.x = Math.floor((end_pos.x - this.drop_zone.x) / (cell_width));
                index_pos.y = Math.floor((end_pos.y - this.drop_zone.y) / (cell_width));
                let max_cell = {
                    x: index_pos.y + (object.vertical && object.index > 0 ? object.index : 0),
                    y: index_pos.x + (!object.vertical && object.index > 0 ? object.index : 0)
                };
                let visible_fantom = ((max_cell.x >= 0 && max_cell.x <= 9)
                    &&
                        (max_cell.y >= 0 && max_cell.y <= 9));
                if (visible_fantom) {
                    let color = this.prepare_frame.is_posible_ship(index_pos.x, index_pos.y, !object.vertical ? object.index : 0, object.vertical ? object.index : 0) ? '_green' : '_red';
                    let fantom = this.fantoms_of_color[color][object.index];
                    fantom.setPosition(this.drop_zone.x + cell_width / 2 + (index_pos.x * cell_width), this.drop_zone.y + cell_width / 2 + (index_pos.y * cell_width));
                    fantom.setScale(object.scale);
                    fantom.setOrigin((cell_width / 2) / (fantom.width * fantom.scale), 0.5);
                    fantom.setAngle(object.vertical ? 90 : 0);
                    fantom.visible = true;
                }
                else {
                    this.clear_fantoms();
                }
            }
            else {
                this.clear_fantoms();
            }
        });
        object.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            gameObject.input.enabled = false;
        });
        object.on('dragend', (pointer, gameObject, dropped) => {
            this.clear_fantoms();
            end_pos = { x: object.x + (!object.stand ? cell_width / 2 : 0), y: object.y - (!object.stand ? cell_width / 2 : 0) };
            if (this.is_in_dropzone(end_pos.x, end_pos.y)) {
                index_pos.x = Math.floor((end_pos.x - this.drop_zone.x) / (cell_width));
                index_pos.y = Math.floor((end_pos.y - this.drop_zone.y) / (cell_width));
                if (this.prepare_frame.add_ship({
                    x: index_pos.x,
                    y: index_pos.y,
                    x_l: !object.vertical ? object.index : 0,
                    y_l: object.vertical ? object.index : 0
                })) {
                    object.stand = true;
                    object.index_pos = index_pos;
                    object.setOrigin((cell_width / 2) / (object.width * object.scale), 0.5);
                    object.setPosition(this.drop_zone.x + cell_width / 2 + (index_pos.x * cell_width), this.drop_zone.y + cell_width / 2 + (index_pos.y * cell_width));
                    this.last_ship = object;
                    this.update_buttons();
                }
                else {
                    this.catch_stand(object);
                }
            }
            else {
                if (object.stand) {
                    this.prepare_frame.remove_ship({
                        x: object.index_pos.x,
                        y: object.index_pos.y,
                        x_l: !object.vertical ? object.index : 0,
                        y_l: object.vertical ? object.index : 0,
                    });
                }
                this.catch_stand(object);
            }
        });
    }
    create_ships(game_scale, cell_width) {
        let rules = global_data.game_play.default_rules;
        global_data.game_play.default_rules;
        let start_coords;
        let boat_count;
        let boat_name;
        let boat_img;
        this.ships = [];
        let boat_index;
        for (let boat_string_index in rules.ships.boats) {
            start_coords = { x: cell_width * 26, y: cell_width * 12 };
            boat_count = rules.ships.boats[boat_string_index];
            boat_name = 'ship_';
            boat_index = parseInt(boat_string_index);
            boat_name += (boat_index + 1);
            start_coords.y -= boat_index * 2 * cell_width;
            for (let i = 0; i < boat_count; i++) {
                boat_img = new Phaser.GameObjects.Image(this.scene, start_coords.x - (((i + 1) * (2 + boat_index)) * cell_width), start_coords.y, boat_name);
                boat_img.setOrigin(0, 1);
                boat_img.setScale(cell_width / boat_img.height);
                boat_img.index = boat_index;
                boat_img.vertical = false;
                this.add(boat_img);
                this.ships.push(boat_img);
                this.set_drag_interactive(boat_img, game_scale, cell_width);
            }
        }
    }
    is_rotate_ship() {
        let ship = this.last_ship;
        let ship_data = { x: 0, y: 0, x_l: 0, y_l: 0 };
        let possible = false;
        if (ship) {
            let index = -1;
            ship_data.x = ship.index_pos.x;
            ship_data.y = ship.index_pos.y;
            ship_data.x_l = (!ship.vertical ? ship.index : 0);
            ship_data.y_l = (ship.vertical ? ship.index : 0);
            this.prepare_frame.ships.forEach((p_ship, i) => {
                if (p_ship.x == ship_data.x &&
                    p_ship.y == ship_data.y &&
                    p_ship.x_l == ship_data.x_l &&
                    p_ship.y_l == ship_data.y_l)
                    index = i;
            });
            if (index >= 0) {
                this.prepare_frame.remove_ship({
                    x: ship_data.x,
                    y: ship_data.y,
                    x_l: !ship.vertical ? ship.index : 0,
                    y_l: ship.vertical ? ship.index : 0,
                });
                ship.vertical = !ship.vertical;
                possible = this.prepare_frame.is_posible_ship(ship_data.x, ship_data.y, !ship.vertical ? ship.index : 0, ship.vertical ? ship.index : 0);
                ship.vertical = !ship.vertical;
                this.prepare_frame.add_ship({
                    x: ship_data.x,
                    y: ship_data.y,
                    x_l: !ship.vertical ? ship.index : 0,
                    y_l: ship.vertical ? ship.index : 0
                });
            }
        }
        return possible;
    }
    rotate_ship() {
        let ship = this.last_ship;
        if (ship) {
            this.prepare_frame.remove_ship({
                x: ship.index_pos.x,
                y: ship.index_pos.y,
                x_l: !ship.vertical ? ship.index : 0,
                y_l: ship.vertical ? ship.index : 0,
            });
            ship.vertical = !ship.vertical;
            ship.setAngle(ship.vertical ? 90 : 0);
            this.prepare_frame.add_ship({
                x: ship.index_pos.x,
                y: ship.index_pos.y,
                x_l: !ship.vertical ? ship.index : 0,
                y_l: ship.vertical ? ship.index : 0
            });
        }
    }
    is_random() {
        return this.prepare_frame.ships.length === 0;
    }
    random_field() {
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale;
        let ships_length = this.ships.length;
        let ship;
        let vertical = false;
        let random_x = 0;
        let random_y = 0;
        const stand_ship = () => {
            vertical = Math.random() > 0.5;
            random_x = Phaser.Math.Between(0, 9);
            random_y = Phaser.Math.Between(0, 9);
            if (this.prepare_frame.add_ship({
                x: random_x,
                y: random_y,
                x_l: !vertical ? ship.index : 0,
                y_l: vertical ? ship.index : 0
            })) {
                ship.stand = true;
                ship.index_pos = { x: random_x, y: random_y };
                ship.setOrigin((cell_width / 2) / (ship.width * ship.scale), 0.5);
                ship.setAngle(vertical ? 90 : 0);
                ship.setPosition(this.drop_zone.x + cell_width / 2 + (random_x * cell_width), this.drop_zone.y + cell_width / 2 + (random_y * cell_width));
                this.last_ship = ship;
                this.update_buttons();
            }
            else {
                stand_ship();
            }
        };
        for (let i = ships_length - 1; i >= 0; i--) {
            ship = this.ships[i];
            stand_ship();
        }
    }
    random_bot_field() {
        let rules = global_data.game_play.default_rules;
        let vertical = false;
        let random_x = 0;
        let random_y = 0;
        let boat_count = 0;
        let boat_index = 0;
        let boat_name = '';
        const stand_ship = (index) => {
            vertical = Math.random() > 0.5;
            random_x = Phaser.Math.Between(0, 9);
            random_y = Phaser.Math.Between(0, 9);
            if (!this.prepare_frame.add_ship({
                x: random_x,
                y: random_y,
                x_l: !vertical ? index : 0,
                y_l: vertical ? index : 0
            })) {
                stand_ship(index);
            }
        };
        for (let boat_string_index in rules.ships.boats) {
            boat_count = rules.ships.boats[boat_string_index];
            boat_index = parseInt(boat_string_index);
            boat_name += (boat_index + 1);
            for (let i = 0; i < boat_count; i++) {
                stand_ship(boat_index);
            }
        }
    }
    update_buttons() {
        this.is_rotate = this.is_rotate_ship();
        this.is_random_field = this.is_random();
        this.is_bot = global_data['game_play'].with_bot;
        this.done_field = this.prepare_frame.get_filling() >= global_data['game_play'].default_rules.filling;
        this.done_icon.visible = this.done_field;
        this.random_button.alpha = this.is_random_field ? 1 : 0.7;
        this.play_button.alpha = this.done_field ? 1 : 0.7;
        // this.next_button.visible = !this.is_bot && global_data.game_play.fields.length === 0;
        // this.play_button.visible = this.is_bot || global_data.game_play.fields.length === 1;
    }
    create_buttons(game_scale, cell_width) {
        let temp;
        let text;
        this.save_button = new CustomButton(this.scene, {
            x: cell_width * 15,
            y: cell_width * 6 + 7,
            atlas: 'game_play',
            frame_out: 'mini_button',
            callback: () => {
                // if(this.is_rotate_ship()) this.rotate_ship();
                game_container.windows_manager.show_window('save_field');
            }
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'game_play', 'save_icon_dark');
        this.save_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'SAVE', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.save_button.add(text);
        this.add(this.save_button);
        this.random_button = new CustomButton(this.scene, {
            x: cell_width * 15,
            y: cell_width * 11 + 7,
            atlas: 'game_play',
            frame_out: 'mini_button',
            callback: () => {
                if (this.is_random()) {
                    this.random_field();
                }
            }
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'new', 'auto_icon');
        this.random_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'AUTO', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.random_button.add(text);
        this.add(this.random_button);
        this.reset_button = new CustomButton(this.scene, {
            x: cell_width * 15,
            y: cell_width * 14 + 7,
            atlas: 'game_play',
            frame_out: 'mini_button',
            callback: () => {
                // if(this.is_random()) {
                //     this.random_field();
                // }
                game_container.windows_manager.show_window('result_battle');
            }
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'new', 'reset_icon');
        this.reset_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'RESET', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.reset_button.add(text);
        this.reset_button.alpha = 0.7;
        this.add(this.reset_button);
        this.play_button = new CustomButton(this.scene, {
            x: this.reset_button.x + 7 * cell_width,
            y: this.reset_button.y - 7,
            frame_out: 'next_play_button',
            callback: () => {
                if (this.prepare_frame.get_filling() >= global_data['game_play'].default_rules.filling) {
                    global_data['game_play'].fields.push({ field: this.prepare_frame.field, ships: this.prepare_frame.ships });
                    if (this.is_bot) {
                        this.prepare_frame.clear();
                        this.random_bot_field();
                        global_data['game_play'].fields.push({ field: this.prepare_frame.field, ships: this.prepare_frame.ships });
                    }
                    game_container.game_play.update_scenes('prepare_arsenal');
                }
            }
        });
        // this.play_button.scale = 0.7;
        text = new Phaser.GameObjects.Text(this.scene, 0, 0, 'BATTLE', { fontFamily: 'rubik', fontSize: 64 });
        text.setOrigin(0.5);
        this.play_button.add(text);
        this.add(this.play_button);
        // this.next_button = new CustomButton(this.scene, {
        //     x: this.play_button.x,
        //     y: this.play_button.y,
        //     atlas: 'common1',
        //     image: 'NextPlayerBtn',
        //     callback: () => {
        //         if(this.prepare_frame.get_filling() >= global_data['game_play'].default_rules.filling) {
        //             global_data['game_play'].fields.push({field: this.prepare_frame.field, ships: this.prepare_frame.ships});
        //             game.switch_window('prepare_field');
        //         }
        //     }
        // });
        // this.add(this.next_button);
        this.update_buttons();
    }
    init(params) {
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale;
        this.done_icon = new Phaser.GameObjects.Image(this.scene, cell_width * 22, cell_width * 9, 'game_play', 'done_icon');
        this.add(this.done_icon);
        let temp = new Phaser.GameObjects.Image(this.scene, cell_width * 8, cell_width * 3.5 + 2, 'new', 'plank');
        temp.scale = cell_width * 10 / temp.width;
        this.add(temp);
        let text = new Phaser.GameObjects.Text(this.scene, cell_width * 8, cell_width * 3.5 + 2, 'SEA MAP', { fontFamily: 'rubik', fontSize: 36 });
        text.setOrigin(0.5);
        this.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 21, cell_width * 3.5 + 2, 'new', 'plank');
        temp.scale = cell_width * 10 / temp.width;
        this.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 21, cell_width * 3.5 + 2, 'SHIPS', { fontFamily: 'rubik', fontSize: 36 });
        text.setOrigin(0.5);
        this.add(text);
        this.create_field(cell_width);
        this.prepare_frame = new PrepareFrame();
        this.create_drop_zone(game_scale, cell_width);
        this.create_fantoms_ships(game_scale, cell_width);
        this.create_ships(game_scale, cell_width);
        this.create_buttons(game_scale, cell_width);
    }
    handler_close() {
        this.clear_fantoms();
        this.prepare_frame.clear();
        this.clear_ships();
    }
    create_field(cell_width) {
        let temp;
        this.field_frame = new Phaser.GameObjects.Graphics(this.scene);
        this.field_frame.fillStyle(0xFFFFFF, 0);
        let x = cell_width * 3;
        let y = cell_width * 5;
        let width = cell_width * 10;
        let height = cell_width * 10;
        this.field_frame.fillRect(x, y, width, height);
        this.add(this.field_frame);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 8, cell_width * 10, 'new', 'field_frame');
        temp.scale = 1.02;
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
