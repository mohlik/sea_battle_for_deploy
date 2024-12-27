class GamePlayScene extends Phaser.GameObjects.Container {
    first_player_field: GameField
    second_player_field: GameField
    first_bg: Phaser.GameObjects.Graphics
    second_bg: Phaser.GameObjects.Graphics
    turn_arrow: Phaser.GameObjects.Image
    turn_timer: Phaser.GameObjects.Text
    timer: Phaser.Time.TimerEvent
    bot: Bot

    constructor(scene: Phaser.Scene, params: any) {
        super(scene);
        this.init(params);
    }

    check_endgame() {
        if(this.first_player_field.all_cells_was_hited() || 
        this.first_player_field.all_ships_was_hited()) {
            console.log('Second Player Wins!');
            global_data['game_play'].fields = [];
            game_container.update_scenes('game_menu');
            return false;
        }
        if(this.second_player_field.all_cells_was_hited() || 
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
        let cell_width = 58 * game_scale;
        let bot_delay = 300;
        this.first_player_field = new GameField(this.scene, {
            field: global_data.game_play.fields[0].field,
            ships: global_data.game_play.fields[0].ships,
            x: cell_width * 3,
            y: cell_width * 4,
            hit_start: () => {
                this.first_player_field.off_turn();
                this.stop_timer();
            },
            hit_ignore: () => {
                if(!global_data.game_play.with_bot) {
                    this.first_player_field.on_turn();
                }
                else {
                    let bot_point = this.bot.turn();
                    setTimeout(() => {
                        this.first_player_field.hit(
                            bot_point.x,
                            bot_point.y
                        );
                    }, bot_delay);
                }
            },
            hit_callback: (succsec_hit: boolean) => {
                if(!succsec_hit) {
                    this.flip_arrow(false, () => {
                        if(this.check_endgame()) {
                            this.second_player_field.on_turn();
                        };
                    });
                } else {
                    this.flip_arrow(true, () => {
                        this.check_endgame();
                        if(!global_data.game_play.with_bot) {
                            this.first_player_field.on_turn();
                        } else {
                            let bot_point = this.bot.turn();
                            setTimeout(() => {
                                this.first_player_field.hit(
                                    bot_point.x,
                                    bot_point.y
                                );
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
            y: cell_width * 4,
            hit_start: () => {
                this.second_player_field.off_turn();
                this.stop_timer();
            },
            hit_ignore: () => {
                this.second_player_field.on_turn();
            },
            hit_callback: (succsec_hit: boolean) => {
                if(!succsec_hit) {
                    this.flip_arrow(true, () => {
                        if(!global_data.game_play.with_bot) {
                            if(this.check_endgame()) {
                                this.first_player_field.on_turn();
                            };
                        } else {
                            let bot_point = this.bot.turn();
                            setTimeout(() => {
                                this.first_player_field.hit(
                                    bot_point.x,
                                    bot_point.y
                                );
                            }, bot_delay);
                        }
                    });
                } else {
                    this.flip_arrow(false, () => {
                        this.check_endgame();
                        this.second_player_field.on_turn();
                    });
                }
            }
        });
        this.second_player_field.on_turn();
        this.flip_arrow(false, () => {});
        this.add(this.second_player_field);
        console.log(global_data.game_play.fields[0].field);
        if(global_data.game_play.with_bot) this.bot = new Bot(global_data.game_play.fields[0].field);
    }

    clear_field() {
        if(this.first_player_field) this.first_player_field.destroy();
        if(this.second_player_field) this.second_player_field.destroy();
    }

    set_timer(side: boolean) {
        let bot_delay = 500;
        let sec_count = 30;
        this.turn_timer.text = sec_count.toString();
        this.timer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                sec_count--;
                if(sec_count > 0) {
                    this.turn_timer.text = sec_count.toString();
                } else {
                    this.stop_timer();
                    this.flip_arrow(!side, () => {
                        if(side) {
                            if(!global_data.game_play.with_bot) {
                                this.first_player_field.on_turn();
                            } else {
                                let bot_point = this.bot.turn();
                                setTimeout(() => {
                                    this.first_player_field.hit(
                                        bot_point.x,
                                        bot_point.y
                                    );
                                }, bot_delay);
                            }
                        } else {
                            if(!global_data.game_play.with_bot) {
                                if(this.check_endgame()) {
                                    this.second_player_field.on_turn();
                                };
                            } else {
                                let bot_point = this.bot.turn();
                                setTimeout(() => {
                                    this.first_player_field.hit(
                                        bot_point.x,
                                        bot_point.y
                                    );
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

    flip_arrow(side: boolean, on_complete: Function) {
        if(this.timer) this.timer.remove();
        if(side !== this.turn_arrow.flipX) {
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
        } else {
            on_complete();
            this.set_timer(side);
        }
    }

    stop_timer() {
        if(this.timer) this.timer.remove();
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
        let cell_width = 58 * game_scale;
        
        this.first_bg = this.create_field(cell_width * 3, cell_width);
        this.add(this.first_bg);

        this.second_bg = this.create_field(cell_width * 16, cell_width);
        this.add(this.second_bg);

        this.turn_arrow = new Phaser.GameObjects.Image(this.scene, cell_width * 14.5, cell_width * 9, 'turn_arrow');
        this.add(this.turn_arrow);

        this.turn_timer = new Phaser.GameObjects.Text(this.scene, this.turn_arrow.x, this.turn_arrow.y, '', {fontSize: 24, strokeThickness: 4, stroke: '#70fg09'});
        this.turn_timer.setOrigin(0.5);
        this.add(this.turn_timer);

        this.create_profiles(cell_width);
    }

    create_profiles(cell_width: number) {
        let profile_container = new Phaser.GameObjects.Container(this.scene, cell_width * 4, cell_width * 2.5);
        profile_container.scale = 0.86;
        this.add(profile_container);

        let ava_frame = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ava_frame');
        let ava = new Phaser.GameObjects.Image(this.scene, ava_frame.x, ava_frame.y, 'default_character');
        let profile_name = new Phaser.GameObjects.Text(this.scene, 0, 0, global_data.user_data.name, {fontSize: 36,strokeThickness: 4, stroke: '#70fg09'});
        profile_name.y = ava.y + ava.height / 2
        profile_name.x = ava.x + ava.width / 2 + 20;
        profile_name.setOrigin(0, 1);

        profile_container.add([ava_frame, ava, profile_name]);

        let oponent_container = new Phaser.GameObjects.Container(this.scene, cell_width * 25, cell_width * 2.5);
        oponent_container.scale = 0.86;
        this.add(oponent_container);

        let oponent_ava_frame = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ava_frame');
        let oponent_ava = new Phaser.GameObjects.Image(this.scene, oponent_ava_frame.x, oponent_ava_frame.y, 'default_character');
        oponent_ava_frame.setFlipX(true);
        oponent_ava.setFlipX(true);

        let oponent_name = new Phaser.GameObjects.Text(this.scene, 0, 0, 'Bot', {fontSize: 36,strokeThickness: 4, stroke: '#70fg09'});
        oponent_name.y = ava.y + oponent_ava.height / 2
        oponent_name.x = ava.x - oponent_ava.width / 2 - 20;
        oponent_name.setOrigin(1, 1);

        oponent_container.add([oponent_ava_frame, oponent_ava, oponent_name]);
    }

    create_field(x: number, cell_width: number): Phaser.GameObjects.Graphics {
        let field_frame = new Phaser.GameObjects.Graphics(this.scene);
        field_frame.lineStyle(3, 0x072279, 1);
        let y: number = cell_width * 4;
        let width: number = cell_width * 10;
        let height: number = cell_width * 10;
        field_frame.strokeRoundedRect(x, y, width, height, 5);
        return field_frame
    }

    handler_close(): void {

    }
}