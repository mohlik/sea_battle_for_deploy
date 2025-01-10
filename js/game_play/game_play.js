class GamePlayScene extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }
    check_endgame() {
        if (this.first_player_field.all_cells_was_hited() ||
            this.first_player_field.all_ships_was_hited()) {
            console.log('Second Player Wins!');
            global_data['game_play'].fields = [];
            game_container.update_scenes('game_menu');
            return false;
        }
        if (this.second_player_field.all_cells_was_hited() ||
            this.second_player_field.all_ships_was_hited()) {
            console.log('First Player Wins!');
            global_data['game_play'].fields = [];
            game_container.update_scenes('game_menu');
            return false;
        }
        return true;
    }
    show(params) {
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale;
        let bot_delay = 300;
        this.first_player_field = new GameField(this.scene, {
            field: global_data.game_play.fields[0].field,
            ships: global_data.game_play.fields[0].ships,
            x: cell_width * 3,
            y: cell_width * 4.5,
            hit_start: () => {
                this.first_player_field.off_turn();
                this.stop_timer();
            },
            hit_ignore: () => {
                if (!global_data.game_play.with_bot) {
                    this.first_player_field.on_turn();
                }
                else {
                    let bot_point = this.bot.turn();
                    setTimeout(() => {
                        this.first_player_field.hit(bot_point.x, bot_point.y);
                    }, bot_delay);
                }
            },
            hit_callback: (succsec_hit) => {
                if (!succsec_hit) {
                    this.flip_arrow(false, () => {
                        if (this.check_endgame()) {
                            this.second_player_field.on_turn();
                        }
                        ;
                    });
                }
                else {
                    this.flip_arrow(true, () => {
                        this.check_endgame();
                        if (!global_data.game_play.with_bot) {
                            this.first_player_field.on_turn();
                        }
                        else {
                            let bot_point = this.bot.turn();
                            setTimeout(() => {
                                this.first_player_field.hit(bot_point.x, bot_point.y);
                            }, bot_delay);
                        }
                    });
                }
            }
        });
        this.first_player_field.off_turn();
        this.add(this.first_player_field);
        this.second_player_field = new GameField(this.scene, {
            field: global_data.game_play.fields[1].field,
            ships: global_data.game_play.fields[1].ships,
            x: cell_width * 16,
            y: cell_width * 4.5,
            hit_start: () => {
                this.second_player_field.off_turn();
                this.stop_timer();
            },
            hit_ignore: () => {
                this.second_player_field.on_turn();
            },
            hit_callback: (succsec_hit) => {
                if (!succsec_hit) {
                    this.flip_arrow(true, () => {
                        if (!global_data.game_play.with_bot) {
                            if (this.check_endgame()) {
                                this.first_player_field.on_turn();
                            }
                            ;
                        }
                        else {
                            let bot_point = this.bot.turn();
                            setTimeout(() => {
                                this.first_player_field.hit(bot_point.x, bot_point.y);
                            }, bot_delay);
                        }
                    });
                }
                else {
                    this.flip_arrow(false, () => {
                        this.check_endgame();
                        this.second_player_field.on_turn();
                    });
                }
            }
        });
        this.second_player_field.on_turn();
        this.flip_arrow(false, () => { });
        this.add(this.second_player_field);
        console.log(global_data.game_play.fields[0].field);
        if (global_data.game_play.with_bot)
            this.bot = new Bot(global_data.game_play.fields[0].field);
        this.create_arsenal();
        this.create_skill_flat();
    }
    create_skill_flat() {
        this.skill_flat_active = true;
        this.skill_name = 'torpedo';
        let cell_width = global_data.cell_width;
        this.skill_flat_container = new Phaser.GameObjects.Container(this.scene, this.second_player_field.x + cell_width * 5, this.second_player_field.y + cell_width * 5);
        this.add(this.skill_flat_container);
        this.skill_flat_container.visible = false;
        let flat = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, cell_width * 10, cell_width * 10, 0xffffff);
        flat.alpha = 0.3;
        flat.visible = true;
        this.skill_flat_container.add(flat);
        flat.setInteractive();
        let flat_down = false;
        flat
            .on('pointerdown', () => {
            if (this.skill_flat_active)
                flat_down = true;
        })
            .on('pointerup', (pointer) => {
            if (this.skill_flat_active) {
                flat_down = false;
                let x = Math.floor((pointer.position.x - this.skill_flat_container.x + 5 * cell_width) / cell_width);
                let y = Math.floor((pointer.position.y - this.skill_flat_container.y + 5 * cell_width) / cell_width);
                if (this.skill_name === 'bomber') {
                    if (x < 1)
                        x = 1;
                    if (y < 1)
                        y = 1;
                    if (x > 8)
                        x = 8;
                    if (y > 8)
                        y = 8;
                    this.anim_bomber(x, y);
                    this.bomber_mig.visible = false;
                }
                else if (this.skill_name === 'fighter') {
                    if (y < 1)
                        y = 1;
                    if (x > 7)
                        x = 7;
                    if (x < 1)
                        x = 1;
                    this.anim_fighter(x, y);
                    this.fighter_mig.visible = false;
                }
                else if (this.skill_name === 'torpedo') {
                    this.anim_torpedo(y);
                    this.torpedo_mig.visible = false;
                }
                this.skill_flat_active = false;
                this.skill_flat_container.visible = false;
            }
        })
            .on('pointerout', () => {
            if (this.skill_flat_active)
                flat_down = false;
        })
            .on('pointermove', (pointer) => {
            if (flat_down && this.skill_flat_active) {
                let x = Math.floor((pointer.position.x - this.skill_flat_container.x + 5 * cell_width) / cell_width);
                let y = Math.floor((pointer.position.y - this.skill_flat_container.y + 5 * cell_width) / cell_width);
                if (this.skill_name === 'bomber') {
                    if (x < 1)
                        x = 1;
                    if (y < 1)
                        y = 1;
                    if (x > 8)
                        x = 8;
                    if (y > 8)
                        y = 8;
                    this.bomber_mig.setPosition(cell_width * 0.5 + cell_width * x - 5 * cell_width, cell_width * 0.5 + cell_width * y - 5 * cell_width);
                }
                else if (this.skill_name === 'fighter') {
                    if (y < 1)
                        y = 1;
                    if (x > 7)
                        x = 7;
                    if (x < 1)
                        x = 1;
                    this.fighter_mig.setPosition(cell_width * 1.5 + cell_width * x - 5 * cell_width, cell_width * 0.5 + cell_width * y - 5 * cell_width);
                }
                else if (this.skill_name === 'torpedo') {
                    this.torpedo_mig.y = y * cell_width + cell_width * 0.5 - 4 * cell_width;
                }
            }
        });
        let temp;
        this.bomber_mig = new Phaser.GameObjects.Container(this.scene, cell_width * 1.5 - cell_width * 5, cell_width * 1.5 - cell_width * 5);
        for (let y = 0; y < 3; y++) {
            for (let x = 0; x < 3; x++) {
                temp = new Phaser.GameObjects.Image(this.scene, -cell_width + cell_width * x, -cell_width + cell_width * y, 'point_cell');
                this.bomber_mig.add(temp);
            }
        }
        this.bomber_mig.visible = false;
        this.skill_flat_container.add(this.bomber_mig);
        this.fighter_mig = new Phaser.GameObjects.Container(this.scene, cell_width * 2.5 - cell_width * 5, cell_width * 1.5 - cell_width * 5);
        for (let y = 0; y < 2; y++) {
            for (let x = 0; x < 4; x++) {
                temp = new Phaser.GameObjects.Image(this.scene, -cell_width * 2 + cell_width * x, -cell_width * 1 + cell_width * y, 'point_cell');
                this.fighter_mig.add(temp);
            }
        }
        this.fighter_mig.visible = false;
        this.skill_flat_container.add(this.fighter_mig);
        this.torpedo_mig = new Phaser.GameObjects.Container(this.scene, cell_width * 0.5, -cell_width * 3.5);
        for (let y = 0; y < 1; y++) {
            for (let x = 0; x < 10; x++) {
                temp = new Phaser.GameObjects.Image(this.scene, -cell_width * 5 + cell_width * x, -cell_width * 1 + cell_width * y, 'point_cell');
                this.torpedo_mig.add(temp);
            }
        }
        this.torpedo_mig.visible = false;
        this.skill_flat_container.add(this.torpedo_mig);
        // this.bomber_mig = new Phaser.GameObjects.Container(this.scene, 0, 0);
        // for(let y = 0; y < 3; y++) {
        //     for(let x = 0; x < 3; x++) {
        //     }
        // }
        // skill_flat_container.add(this.bomber_mig);
    }
    hit_diapozone(x, y, x_c, y_c) {
        let success = false;
        let temp_success = false;
        for (let y_i = 0; y_i < y_c; y_i++) {
            for (let x_i = 0; x_i < x_c; x_i++) {
                temp_success = this.second_player_field.hit(x + x_i, y + y_i, true);
                if (temp_success)
                    success = true;
            }
        }
        return success;
    }
    anim_bomber(x, y) {
        let cell_width = global_data.cell_width;
        let plane = new Phaser.GameObjects.Image(this.scene, -300, y * cell_width + this.second_player_field.y - cell_width, 'bomber');
        plane.setFlipX(true);
        this.add(plane);
        this.scene.tweens.add({
            targets: plane,
            x: x * cell_width + this.second_player_field.x - cell_width,
            duration: 3000,
            onComplete: () => {
                let success = this.hit_diapozone(x - 1, y - 1, 3, 3);
                this.scene.tweens.add({
                    targets: plane,
                    x: game_size.width + 300,
                    duration: 3000,
                    onComplete: () => {
                        this.second_player_field.hit_callback(success);
                        plane.destroy();
                    }
                });
            }
        });
    }
    anim_fighter(x, y) {
        let cell_width = global_data.cell_width;
        let plane = new Phaser.GameObjects.Image(this.scene, -300, y * cell_width + this.second_player_field.y - cell_width, 'fighter');
        plane.setFlipX(true);
        this.add(plane);
        this.scene.tweens.add({
            targets: plane,
            x: x * cell_width + this.second_player_field.x - cell_width,
            duration: 3000,
            onComplete: () => {
                let success = this.hit_diapozone(x - 1, y - 1, 4, 2);
                this.scene.tweens.add({
                    targets: plane,
                    x: game_size.width + 300,
                    duration: 3000,
                    onComplete: () => {
                        this.second_player_field.hit_callback(success);
                        plane.destroy();
                    }
                });
            }
        });
        // let plane = new Phaser.GameObjects.Image(this.scene, 0)
    }
    anim_torpedo(y) {
        let cell_width = global_data.cell_width;
        let plane = new Phaser.GameObjects.Image(this.scene, -300, y * cell_width + this.second_player_field.y - cell_width, 'torpedo');
        plane.setFlipX(true);
        this.add(plane);
        let torpedo_iter = 0;
        const torpedo_move = () => {
            setTimeout(() => {
                let succsec = false;
                succsec = this.second_player_field.hit(torpedo_iter, y, true);
                torpedo_iter++;
                if (succsec)
                    torpedo_iter = 10;
                if (torpedo_iter < 10)
                    torpedo_move();
            }, 100);
        };
        this.scene.tweens.add({
            targets: plane,
            x: game_size.width / 2,
            duration: 3000,
            onComplete: () => {
                torpedo_move();
                this.scene.tweens.add({
                    targets: plane,
                    x: game_size.width + 300,
                    duration: 3000,
                    onComplete: () => {
                        plane.destroy();
                    }
                });
            }
        });
    }
    clear_field() {
        if (this.first_player_field)
            this.first_player_field.destroy();
        if (this.second_player_field)
            this.second_player_field.destroy();
    }
    set_timer(side) {
        let bot_delay = 500;
        let sec_count = 30;
        this.turn_timer.text = sec_count.toString();
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                sec_count--;
                if (sec_count > 0) {
                    this.turn_timer.text = sec_count.toString();
                }
                else {
                    this.stop_timer();
                    this.flip_arrow(!side, () => {
                        if (side) {
                            if (!global_data.game_play.with_bot) {
                                this.first_player_field.on_turn();
                            }
                            else {
                                let bot_point = this.bot.turn();
                                setTimeout(() => {
                                    this.first_player_field.hit(bot_point.x, bot_point.y);
                                }, bot_delay);
                            }
                        }
                        else {
                            if (!global_data.game_play.with_bot) {
                                if (this.check_endgame()) {
                                    this.second_player_field.on_turn();
                                }
                                ;
                            }
                            else {
                                let bot_point = this.bot.turn();
                                setTimeout(() => {
                                    this.first_player_field.hit(bot_point.x, bot_point.y);
                                }, bot_delay);
                            }
                        }
                    });
                }
            },
            callbackScope: this,
            repeat: 29
        });
    }
    flip_arrow(side, on_complete) {
        if (this.timer)
            this.timer.remove();
        if (side !== this.turn_arrow.flipX) {
            this.scene.tweens.add({
                targets: this.turn_arrow,
                duration: 100,
                scaleX: 0,
                onComplete: () => {
                    this.turn_arrow.setFlipX(side);
                    this.scene.tweens.add({
                        targets: this.turn_arrow,
                        duration: 100,
                        scaleX: 1,
                        onComplete: () => {
                            on_complete();
                            this.set_timer(side);
                        }
                    });
                }
            });
        }
        else {
            on_complete();
            this.set_timer(side);
        }
    }
    stop_timer() {
        if (this.timer)
            this.timer.remove();
        this.turn_timer.text = '';
    }
    init(params) {
        this.scene.anims.create({
            key: 'explo',
            frames: [
                { key: 'explo_1' },
                { key: 'explo_2' },
                { key: 'explo_3' },
                { key: 'explo_4' },
                { key: 'explo_5' },
                { key: 'explo_6' },
                { key: 'explo_7' }
            ],
            frameRate: 16,
            showOnStart: true,
            hideOnComplete: true
        });
        this.scene.anims.create({
            key: 'splash',
            frames: [
                { key: 'splash_1' },
                { key: 'splash_2' },
                { key: 'splash_3' },
                { key: 'splash_4' },
                { key: 'splash_5' },
                { key: 'splash_6' }
            ],
            frameRate: 16,
            showOnStart: true,
            hideOnComplete: true
        });
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale;
        this.first_bg = this.create_field(cell_width * 3, cell_width);
        this.add(this.first_bg);
        this.second_bg = this.create_field(cell_width * 16, cell_width);
        this.add(this.second_bg);
        this.turn_arrow = new Phaser.GameObjects.Image(this.scene, cell_width * 14.5, cell_width * 9.5, 'turn_arrow');
        this.add(this.turn_arrow);
        this.turn_timer = new Phaser.GameObjects.Text(this.scene, this.turn_arrow.x, this.turn_arrow.y, '', { fontSize: 24, strokeThickness: 4, stroke: '#70fg09' });
        this.turn_timer.setOrigin(0.5);
        this.add(this.turn_timer);
        this.create_profiles(cell_width);
    }
    create_arsenal() {
        let cell_width = global_data.cell_width;
        this.arsenal_container = new Phaser.GameObjects.Container(this.scene, 0, 0);
        this.arsenal_container.setSize(game_size.width * 2, game_size.height * 2);
        this.arsenal_container.setInteractive();
        this.arsenal_container.on('pointerdown', () => this.hide_arsenal());
        this.arsenal_container.setVisible(false);
        this.add(this.arsenal_container);
        this.arsenal_slider = new SliderBanner(this.scene, {
            background: {
                frame: 'arsenal_slider'
            }
        });
        this.arsenal_slider.setXY(8 * cell_width, 8.5 * cell_width);
        this.arsenal_container.add(this.arsenal_slider);
        let temp;
        [
            'atom',
            'bomber',
            'torpedo',
            'fighter',
            // 'airdef',
            // 'submarine',
            // 'radar',
            // 'mine'
        ].forEach((skill_name, i) => {
            temp = new Phaser.GameObjects.Image(this.scene, cell_width * 4.6, i * cell_width * 4 + 1.8 * cell_width, 'skill_item');
            this.arsenal_slider.add_child(temp);
            temp.setInteractive(
            // {draggable: true}
            );
            // let for_click = true;
            // temp.on('pointerup', () => {
            //     if(for_click) {
            //         // action
            //     }
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
                    this.start_skill(skill_name);
                    this.hide_arsenal();
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
            temp = new Phaser.GameObjects.Text(this.scene, temp.x - 200, temp.y + 50, `${global_data.user_data.skills[skill_name].amount}`, { fontSize: 24, strokeThickness: 4, stroke: '#70fg09' });
            temp.setOrigin(0.5, 0.5);
            this.arsenal_slider.add_child(temp);
        });
        let button = new CustomButton(this.scene, {
            x: cell_width * 14.5,
            y: cell_width * 9.5 + cell_width * 3,
            frame_out: 'game_play_button',
            callback: () => this.show_arsenal()
        });
        button.scale = 0.7;
        this.add(button);
    }
    start_skill(skill_name) {
        if (global_data.user_data.skills[skill_name].amount > 0) {
            global_data.user_data.skills[skill_name].amount--;
            if (skill_name === 'bomber' || skill_name === 'atom') {
                this.skill_name = 'bomber';
                this.skill_flat_active = true;
                this.skill_flat_container.visible = true;
                this.bomber_mig.visible = true;
            }
            else if (skill_name === 'fighter') {
                this.skill_name = 'fighter';
                this.skill_flat_active = true;
                this.skill_flat_container.visible = true;
                this.fighter_mig.visible = true;
            }
            else if (skill_name === 'torpedo') {
                this.skill_name = 'torpedo';
                this.skill_flat_active = true;
                this.skill_flat_container.visible = true;
                this.torpedo_mig.visible = true;
            }
        }
    }
    show_arsenal() {
        this.arsenal_container.setVisible(true);
    }
    hide_arsenal() {
        this.arsenal_container.setVisible(false);
    }
    create_profiles(cell_width) {
        let profile_container = new Phaser.GameObjects.Container(this.scene, cell_width * 4, cell_width * 3);
        profile_container.scale = 0.86;
        this.add(profile_container);
        let ava_frame = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ava_frame');
        let ava = new Phaser.GameObjects.Image(this.scene, ava_frame.x, ava_frame.y, 'default_character');
        let profile_name = new Phaser.GameObjects.Text(this.scene, 0, 0, global_data.user_data.name, { fontSize: 36, strokeThickness: 4, stroke: '#70fg09' });
        profile_name.y = ava.y + ava.height / 2;
        profile_name.x = ava.x + ava.width / 2 + 20;
        profile_name.setOrigin(0, 1);
        profile_container.add([ava_frame, ava, profile_name]);
        let oponent_container = new Phaser.GameObjects.Container(this.scene, cell_width * 25, cell_width * 3);
        oponent_container.scale = 0.86;
        this.add(oponent_container);
        let oponent_ava_frame = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ava_frame');
        let oponent_ava = new Phaser.GameObjects.Image(this.scene, oponent_ava_frame.x, oponent_ava_frame.y, 'default_character');
        oponent_ava_frame.setFlipX(true);
        oponent_ava.setFlipX(true);
        let oponent_name = new Phaser.GameObjects.Text(this.scene, 0, 0, 'Bot', { fontSize: 36, strokeThickness: 4, stroke: '#70fg09' });
        oponent_name.y = ava.y + oponent_ava.height / 2;
        oponent_name.x = ava.x - oponent_ava.width / 2 - 20;
        oponent_name.setOrigin(1, 1);
        oponent_container.add([oponent_ava_frame, oponent_ava, oponent_name]);
    }
    create_field(x, cell_width) {
        let field_container = new Phaser.GameObjects.Container(this.scene, x, cell_width * 4.5);
        let temp;
        let field_frame = new Phaser.GameObjects.Graphics(this.scene);
        field_frame.fillStyle(0xFFFFFF, 0.4);
        // let y: number = cell_width * 4;
        let width = cell_width * 10;
        let height = cell_width * 10;
        field_frame.fillRect(0, 0, width, height);
        field_container.add(field_frame);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 5, cell_width * 5, 'field_frame');
        temp.setScale(0.82);
        field_container.add(temp);
        return field_container;
    }
    handler_close() {
    }
}
