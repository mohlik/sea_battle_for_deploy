class GamePlayScene extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }
    create_back() {
        let temp;
        this.bg = new Phaser.GameObjects.Graphics(this.scene);
        this.bg.fillStyle(0xE9E8E3, 1);
        this.bg.fillRect(0, 0, game_size.width, game_size.height);
        let count_y = Math.ceil(game_size.height / this.cell_width);
        let count_x = Math.ceil(game_size.width / this.cell_width);
        this.bg.lineStyle(2, 0x6171A4, 0.7);
        for (let y = 0; y <= count_y; y++) {
            this.bg.lineBetween(0, y * this.cell_width, game_size.width, y * this.cell_width);
        }
        for (let x = 0; x <= count_x; x++) {
            this.bg.lineBetween(x * this.cell_width, 0, x * this.cell_width, game_size.height);
        }
        this.bg.lineStyle(7, 0xCF4038, 0.9);
        this.bg.lineBetween(0, 3 * this.cell_width, game_size.width, 3 * this.cell_width);
        this.add(this.bg);
    }
    check_endgame() {
        if (this.first_player_field.all_cells_was_hited() ||
            this.first_player_field.all_ships_was_hited()) {
            global_data['game_play'].fields = [];
            // game_container.update_scenes('game_menu');
            game_container.windows_manager.show_window('result_battle', { win: false });
            return false;
        }
        if (this.second_player_field.all_cells_was_hited() ||
            this.second_player_field.all_ships_was_hited()) {
            global_data['game_play'].fields = [];
            // game_container.update_scenes('game_menu');
            game_container.windows_manager.show_window('result_battle', { win: true });
            return false;
        }
        return true;
    }
    show(params) {
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale + 2;
        let bot_delay = 300;
        this.first_player_field = new GameField(this.scene, {
            field: global_data.game_play.fields[0].field,
            ships: global_data.game_play.fields[0].ships,
            x: cell_width * 2,
            y: cell_width * 5,
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
            y: cell_width * 5,
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
        if (global_data.game_play.with_bot)
            this.bot = new Bot(global_data.game_play.fields[0].field);
        // this.create_arsenal();
        this.create_skill_flat();
    }
    create_skill_flat() {
        this.skill_flat_active = true;
        this.skill_name = 'torpedo';
        let cell_width = global_data.cell_width + 2;
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
                else if (this.skill_name === 'atom') {
                    if (x < 1)
                        x = 1;
                    if (y < 1)
                        y = 1;
                    if (x > 6)
                        x = 6;
                    if (y > 6)
                        y = 6;
                    this.anim_atom(x, y);
                    this.atom_mig.visible = false;
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
                else if (this.skill_name === 'radar') {
                    if (x < 1)
                        x = 1;
                    if (y < 1)
                        y = 1;
                    if (x > 7)
                        x = 7;
                    if (y > 7)
                        y = 7;
                    this.anim_radar(x, y);
                    this.radar_mig.visible = false;
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
                else if (this.skill_name === 'atom') {
                    if (x < 1)
                        x = 1;
                    if (y < 1)
                        y = 1;
                    if (x > 6)
                        x = 6;
                    if (y > 6)
                        y = 6;
                    this.atom_mig.setPosition(cell_width * 0.5 + cell_width * x - 5 * cell_width, cell_width * 0.5 + cell_width * y - 5 * cell_width);
                }
                else if (this.skill_name === 'radar') {
                    if (x < 1)
                        x = 1;
                    if (y < 1)
                        y = 1;
                    if (x > 7)
                        x = 7;
                    if (y > 7)
                        y = 7;
                    this.radar_mig.setPosition(cell_width * 0.5 + cell_width * x - 5 * cell_width, cell_width * 0.5 + cell_width * y - 5 * cell_width);
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
        this.atom_mig = new Phaser.GameObjects.Container(this.scene, cell_width * 1.5 - cell_width * 5, cell_width * 1.5 - cell_width * 5);
        for (let y = 0; y < 5; y++) {
            for (let x = 0; x < 5; x++) {
                temp = new Phaser.GameObjects.Image(this.scene, -cell_width + cell_width * x, -cell_width + cell_width * y, 'point_cell');
                this.atom_mig.add(temp);
            }
        }
        this.atom_mig.visible = false;
        this.skill_flat_container.add(this.atom_mig);
        this.radar_mig = new Phaser.GameObjects.Container(this.scene, cell_width * 1.5 - cell_width * 5, cell_width * 1.5 - cell_width * 5);
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                temp = new Phaser.GameObjects.Image(this.scene, -cell_width + cell_width * x, -cell_width + cell_width * y, 'point_cell');
                this.radar_mig.add(temp);
            }
        }
        this.radar_mig.visible = false;
        this.skill_flat_container.add(this.radar_mig);
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
        this.anim_container = new Phaser.GameObjects.Container(this.scene);
        this.add(this.anim_container);
        const shape = this.scene.make.graphics();
        shape.fillStyle(0x00000, 1);
        shape.fillRect(cell_width * 2, cell_width * 5, cell_width * 24, cell_width * 10);
        // shape.fillRect(cell_width * 16, cell_width * 5, cell_width * 10, cell_width * 10);
        const mask = shape.createGeometryMask();
        this.anim_container.setMask(mask);
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
        let cell_width = global_data.cell_width + 2;
        let plane = new Phaser.GameObjects.Image(this.scene, -300, y * cell_width + this.second_player_field.y + 0.5 * cell_width, 'skill_anim', 'bomber_0');
        // plane.setFlipX(true);
        plane.setAngle(90);
        plane.scale = 1.2;
        this.anim_container.add(plane);
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
    anim_atom(x, y) {
        let cell_width = global_data.cell_width + 2;
        let plane = new Phaser.GameObjects.Image(this.scene, -300, y * cell_width + this.second_player_field.y + 0.5 * cell_width, 'skill_anim', 'bomber_0');
        // plane.setFlipX(true);
        plane.setAngle(90);
        plane.scale = 1.2;
        this.anim_container.add(plane);
        this.scene.tweens.add({
            targets: plane,
            x: x * cell_width + this.second_player_field.x - cell_width,
            duration: 3000,
            onComplete: () => {
                let success;
                let explo = new Phaser.GameObjects.Sprite(this.scene, (x + 1.5) * cell_width + this.second_player_field.x, (y + 1.5) * cell_width + this.second_player_field.y, 'skill_anim', 'atom_explo_0');
                explo.once('animationcomplete', () => {
                    success = this.hit_diapozone(x - 1, y - 1, 5, 5);
                    this.scene.tweens.add({
                        targets: explo,
                        alpha: 0,
                        duration: 1000,
                        onComplete: () => {
                            explo.destroy();
                        }
                    });
                });
                this.anim_container.add(explo);
                this.anim_container.sendToBack(explo);
                explo.play('atom_explo');
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
    anim_radar(x, y) {
        let cell_width = global_data.cell_width + 2;
        let cells = [];
        let data_cell;
        let temp;
        let back = new Phaser.GameObjects.Image(this.scene, (x + 1) * cell_width + this.second_player_field.x, (y + 1) * cell_width + this.second_player_field.y, 'skill_anim', 'radar_back');
        back.scale = 0.8;
        back.alpha = 0;
        this.anim_container.add(back);
        let arrow = new Phaser.GameObjects.Image(this.scene, (x + 1) * cell_width + this.second_player_field.x, (y + 1) * cell_width + this.second_player_field.y, 'skill_anim', 'radar_arrow');
        arrow.setOrigin(0, 0);
        arrow.scale = 0.8;
        arrow.alpha = 0;
        this.anim_container.add(arrow);
        this.scene.tweens.add({
            targets: [back, arrow],
            alpha: 1,
            duration: 300
        });
        this.scene.tweens.add({
            targets: [arrow],
            angle: 720,
            duration: 1000,
            onComplete: () => {
                this.scene.tweens.add({
                    targets: [arrow],
                    angle: 720,
                    duration: 1000,
                });
                this.scene.tweens.add({
                    targets: [back, arrow],
                    alpha: 0,
                    duration: 300,
                    onComplete: () => {
                        for (let y_i = y - 1; y_i < y + 3; y_i++) {
                            for (let x_i = x - 1; x_i < x + 3; x_i++) {
                                data_cell = this.second_player_field.get_cell(x_i, y_i, true);
                                if (data_cell && data_cell.succ) {
                                    temp = new Phaser.GameObjects.Image(this.scene, x_i * cell_width + 16.5 * cell_width, y_i * cell_width + 5.5 * cell_width, 'cell_false');
                                    temp.setTint(0x00ff00);
                                    temp.alpha = 0;
                                    this.add(temp);
                                    cells.push(temp);
                                }
                            }
                        }
                        if (this.scene)
                            this.scene.tweens.add({
                                targets: cells,
                                alpha: 1,
                                duration: 300,
                                onComplete: () => {
                                    if (this.scene)
                                        this.scene.tweens.add({
                                            targets: cells,
                                            alpha: 0,
                                            delay: 1000,
                                            duration: 300,
                                            onComplete: () => {
                                                cells.forEach(cell_img => cell_img.destroy());
                                            }
                                        });
                                }
                            });
                    }
                });
            }
        });
    }
    anim_fighter(x, y) {
        let cell_width = global_data.cell_width + 2;
        let broke = true;
        let plane_container = new Phaser.GameObjects.Container(this.scene, -300, y * cell_width + this.second_player_field.y - 0.5 * cell_width);
        let plane = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'skill_anim', 'fighter_0');
        // plane.setFlipX(true);
        plane_container.add(plane);
        plane_container.setAngle(90);
        this.anim_container.add(plane_container);
        if (broke) {
            this.scene.tweens.add({
                targets: plane_container,
                x: 5 * cell_width + this.first_player_field.x,
                duration: 1500,
                onComplete: () => {
                    plane.once('animationcomplete', () => {
                    });
                    this.scene.tweens.add({
                        targets: plane_container,
                        x: x * cell_width + this.second_player_field.x - cell_width,
                        duration: 1500,
                        onComplete: () => {
                            console.log('pih pah');
                            plane.once('animationcomplete', () => {
                            });
                            let success = this.hit_diapozone(x - 1, y - 1, 4, 2);
                            this.scene.tweens.add({
                                targets: plane_container,
                                x: game_size.width + 300,
                                duration: 1500,
                                onComplete: () => {
                                    this.second_player_field.hit_callback(success);
                                    plane.destroy();
                                }
                            });
                            plane.play('fighter_up');
                        }
                    });
                    plane.play('fighter_down');
                }
            });
        }
        else {
            this.scene.tweens.add({
                targets: plane_container,
                x: x * cell_width + this.second_player_field.x - cell_width,
                duration: 3000,
                onComplete: () => {
                    let success = this.hit_diapozone(x - 1, y - 1, 4, 2);
                    this.scene.tweens.add({
                        targets: plane_container,
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
        // let plane = new Phaser.GameObjects.Image(this.scene, 0)
    }
    anim_torpedo(y) {
        let cell_width = global_data.cell_width + 2;
        let plane = new Phaser.GameObjects.Image(this.scene, -300, y * cell_width + this.second_player_field.y - cell_width, 'torpedo');
        plane.setFlipX(true);
        this.anim_container.add(plane);
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
        this.scene.anims.create({
            key: 'fighter_down',
            frames: [
                { key: 'skill_anim', frame: 'fighter_0' },
                { key: 'skill_anim', frame: 'fighter_1' },
                { key: 'skill_anim', frame: 'fighter_2' },
                { key: 'skill_anim', frame: 'fighter_3' }
            ],
            frameRate: 6,
            // showOnStart: true,
            // hideOnComplete: true
        });
        this.scene.anims.create({
            key: 'fighter_up',
            frames: [
                { key: 'skill_anim', frame: 'fighter_3' },
                { key: 'skill_anim', frame: 'fighter_4' },
                { key: 'skill_anim', frame: 'fighter_5' },
                { key: 'skill_anim', frame: 'fighter_0' }
            ],
            frameRate: 6,
            // showOnStart: true,
            // hideOnComplete: true
        });
        this.scene.anims.create({
            key: 'atom_explo',
            frames: [
                { key: 'skill_anim', frame: 'atom_explo_1' },
                { key: 'skill_anim', frame: 'atom_explo_2' },
                { key: 'skill_anim', frame: 'atom_explo_3' },
                { key: 'skill_anim', frame: 'atom_explo_4' },
                { key: 'skill_anim', frame: 'atom_explo_5' },
                { key: 'skill_anim', frame: 'atom_explo_6' },
            ],
            frameRate: 8,
            // showOnStart: true,
            // hideOnComplete: true
        });
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale + 2;
        this.cell_width = cell_width;
        this.create_back();
        // let temp_explo = new Phaser.GameObjects.Sprite(this.scene, cell_width * 8, cell_width * 8, 'skill_anim');
        // this.add(temp_explo);
        // temp_explo.play('atom_explo');
        this.first_bg = this.create_field(cell_width * 2, cell_width);
        this.add(this.first_bg);
        this.second_bg = this.create_field(cell_width * 16, cell_width);
        this.add(this.second_bg);
        this.turn_arrow = new Phaser.GameObjects.Image(this.scene, cell_width * 14, cell_width * 10, 'game_play', 'turn_arrow');
        this.add(this.turn_arrow);
        this.turn_timer = new Phaser.GameObjects.Text(this.scene, this.turn_arrow.x, this.turn_arrow.y, '', { fontFamily: 'rubik', fontSize: 36, strokeThickness: 4, stroke: '#051F79' });
        this.turn_timer.setOrigin(0.5);
        this.add(this.turn_timer);
        this.create_profiles(cell_width);
        this.home_button = new CustomButton(this.scene, {
            x: 14 * this.cell_width,
            y: 14 * this.cell_width + 7,
            atlas: 'new',
            frame_out: 'mini_button',
            callback: () => {
                // game_container.update_scenes('game_menu');
                game_container.windows_manager.show_window('quit_battle');
                // game_container.windows_manager.show_window('result_battle');
                // game_container.windows_manager.show_window('test', {});
            }
        });
        let temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'new', 'home_icon');
        this.home_button.add(temp);
        let text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'HOME', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.home_button.add(text);
        this.add(this.home_button);
        this.chat_button = new CustomButton(this.scene, {
            x: 14 * this.cell_width,
            y: 3 * this.cell_width + 7,
            atlas: 'new',
            frame_out: 'mini_button',
            callback: () => {
                // game_container.update_scenes('game_menu');
                // game_container.windows_manager.show_window('result_battle');
                // game_container.windows_manager.show_window('test', {});
            }
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'new', 'chat_icon');
        this.chat_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'CHAT', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.chat_button.add(text);
        this.chat_button.alpha = 0.7;
        this.add(this.chat_button);
        this.arsenal_button = new CustomButton(this.scene, {
            x: cell_width * 14,
            y: cell_width * 6 + 7,
            atlas: 'new',
            frame_out: 'mini_button',
            callback: () => this.show_arsenal()
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'new', 'arsenal_icon');
        this.arsenal_button.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, 0, 42, 'ARSENAL', { fontFamily: 'rubik', fontSize: 21 });
        text.setOrigin(0.5);
        this.arsenal_button.add(text);
        this.add(this.arsenal_button);
    }
    create_arsenal() {
        let cell_width = global_data.cell_width + 2;
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
            x: cell_width * 14,
            y: cell_width * 6 + 7,
            atlas: 'new',
            frame_out: 'mini_button',
            callback: () => this.show_arsenal()
        });
        temp = new Phaser.GameObjects.Image(this.scene, 0, -17, 'new', 'arsenal_icon');
        button.add(temp);
        this.add(button);
    }
    start_skill(skill_name) {
        if (global_data.user_data.skills[skill_name].amount > 0) {
            global_data.user_data.skills[skill_name].amount--;
            this.skill_flat_active = true;
            this.skill_flat_container.visible = true;
            if (skill_name === 'bomber') {
                this.skill_name = 'bomber';
                this.bomber_mig.visible = true;
            }
            else if (skill_name === 'atom') {
                this.skill_name = 'atom';
                this.atom_mig.visible = true;
            }
            else if (skill_name === 'fighter') {
                this.skill_name = 'fighter';
                this.fighter_mig.visible = true;
            }
            else if (skill_name === 'torpedo') {
                this.skill_name = 'torpedo';
                this.torpedo_mig.visible = true;
            }
            else if (skill_name === 'radar') {
                this.skill_name = 'radar';
                this.radar_mig.visible = true;
            }
        }
    }
    show_arsenal() {
        // this.arsenal_container.setVisible(true);
        game_container.windows_manager.show_window('arsenal');
    }
    hide_arsenal() {
        // this.arsenal_container.setVisible(false);
    }
    create_profiles(cell_width) {
        let temp;
        let text;
        let profile_container = new Phaser.GameObjects.Container(this.scene, cell_width * 2.65, cell_width * 2.35);
        this.add(profile_container);
        let profile_ava = new Phaser.GameObjects.Image(this.scene, 0, 0, 'new', 'profile_ava');
        let profile_name = new Phaser.GameObjects.Text(this.scene, cell_width * 4.35, cell_width * 0.12, global_data.user_data.name.toUpperCase(), { fontSize: 28, fontFamily: 'rubik', color: '#051F79' });
        // profile_name.y = ava.y + ava.height / 2
        // profile_name.x = ava.x + ava.width / 2 + 20;
        profile_name.setOrigin(0.5, 0.5);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 1.85, cell_width * 0.12, 'new', 'micro_plank');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 1.85, cell_width * 1.15, 'new', 'micro_plank');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 1.85, cell_width * 0.12, 'new', 'flag_micro');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 1.85, cell_width * 1.15, 'new', 'rank_micro');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 4.35, cell_width * 0.12, 'new', 'plank_frame');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 4.35, cell_width * 1.15, 'new', 'plank_frame');
        profile_container.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 4.35, cell_width * 1.15, global_data.user_data.rank.stage.toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 28,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        profile_container.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 6.85, cell_width * 0.12, 'new', 'micro_plank');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 6.85, cell_width * 1.15, 'new', 'micro_plank');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 6.85, cell_width * 0.12, 'new', 'rating_micro_icon');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 6.85, cell_width * 1.15, 'new', 'oil_icon');
        profile_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 8.35, cell_width * 0.12, 'new', 'plank_frame_mini');
        profile_container.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 8.35, cell_width * 0.12, global_data.user_data.rating.score.toString().toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 36,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        profile_container.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 8.35, cell_width * 1.15, 'new', 'plank_frame_mini');
        profile_container.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 8.35, cell_width * 1.15, global_data.user_data.oil.amount.toString().toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 36,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        profile_container.add(text);
        profile_container.add([profile_ava, profile_name]);
        let oponent_container = new Phaser.GameObjects.Container(this.scene, cell_width * 25.3, cell_width * 2.35);
        this.add(oponent_container);
        let oponent_ava = new Phaser.GameObjects.Image(this.scene, 0, 0, 'new', 'profile_ava');
        oponent_ava.setFlipX(true);
        let oponent_name = new Phaser.GameObjects.Text(this.scene, cell_width * -4.35, cell_width * 0.12, 'Bot'.toUpperCase(), { fontSize: 28, fontFamily: 'rubik', color: '#051F79' });
        oponent_name.setOrigin(0.5);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -1.85, cell_width * 0.12, 'new', 'micro_plank');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -1.85, cell_width * 1.15, 'new', 'micro_plank');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -1.85, cell_width * 0.12, 'new', 'flag_micro');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -1.85, cell_width * 1.15, 'new', 'rank_micro');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -4.35, cell_width * 0.12, 'new', 'plank_frame');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -4.35, cell_width * 1.15, 'new', 'plank_frame');
        oponent_container.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * -4.35, cell_width * 1.15, global_data.user_data.rank.stage.toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 28,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        oponent_container.add(text);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -6.85, cell_width * 0.12, 'new', 'micro_plank');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -6.85, cell_width * 0.12, 'new', 'rating_micro_icon');
        oponent_container.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * -8.35, cell_width * 0.12, 'new', 'plank_frame_mini');
        oponent_container.add(temp);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * -8.35, cell_width * 0.12, (global_data.user_data.rating.score + Math.floor((Math.random() - Math.random()) * 100)).toString().toUpperCase(), {
            fontFamily: 'rubik',
            fontSize: 36,
            color: '#051F79'
        });
        text.setOrigin(0.5);
        oponent_container.add(text);
        oponent_container.add([oponent_ava, oponent_name]);
    }
    create_field(x, cell_width) {
        let field_container = new Phaser.GameObjects.Container(this.scene, x, cell_width * 5);
        let temp;
        let field_frame = new Phaser.GameObjects.Graphics(this.scene);
        field_frame.fillStyle(0xFFFFFF, 0);
        let width = cell_width * 10;
        let height = cell_width * 10;
        field_frame.fillRect(0, 0, width, height);
        field_container.add(field_frame);
        temp = new Phaser.GameObjects.Image(this.scene, cell_width * 5, cell_width * 5, 'new', 'field_frame');
        temp.setScale(1.05);
        field_container.add(temp);
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
            text = new Phaser.GameObjects.Text(this.scene, x < game_size.width / 2 ? -0.5 * cell_width : 10.5 * cell_width, 0.5 * cell_width + cell_width * i, letter, {
                fontFamily: 'rubik',
                fontSize: 36,
                color: '#051F79'
            });
            text.setOrigin(0.5);
            field_container.add(text);
            text = new Phaser.GameObjects.Text(this.scene, 0.5 * cell_width + cell_width * i, -0.5 * cell_width, i.toString(), {
                fontFamily: 'rubik',
                fontSize: 36,
                color: '#051F79'
            });
            text.setOrigin(0.5);
            field_container.add(text);
        });
        return field_container;
    }
    handler_close() {
    }
}
