class GameField extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.init(params);
    }
    on_turn() {
        this.turn = true;
    }
    off_turn() {
        this.turn = false;
        // this.point_cell.visible = false;
        this.points_x.forEach(point_x => {
            point_x.visible = false;
        });
        this.points_y.forEach(point_y => {
            point_y.visible = false;
        });
        // this.point_aim.visible = false;
    }
    all_cells_was_hited() {
        return this.all_cells_count === this.hited_cells_count;
    }
    all_ships_was_hited() {
        return this.all_ships_count === this.hited_ships_count;
    }
    get_cell(x, y, just_get) {
        let cell = null;
        this.cells_imgs.forEach(cell_obj => {
            if (x === cell_obj.x && y === cell_obj.y) {
                cell = cell_obj;
                if (!this.hited_cells.some(cell => cell.x === x && cell.y === y) && !just_get)
                    this.hited_cells_count++;
            }
        });
        if (!just_get)
            this.hited_cells.push({ x, y });
        return cell;
    }
    check_ship(x, y) {
        let ship;
        this.ships_arr.forEach(ship_obj => {
            if (ship_obj.cells.some(cell => cell.x === x && cell.y === y)) {
                ship = ship_obj;
            }
        });
        if (ship) {
            let death_ship = true;
            ship.cells.forEach(ship_cell => {
                if (!this.hited_cells.some(cell => cell.x === ship_cell.x && cell.y === ship_cell.y)) {
                    death_ship = false;
                }
            });
            ship.visible = death_ship;
            if (death_ship) {
                this.hited_ships_count++;
                let min_x = ship.cells[0].x - 1;
                let max_x = ship.cells[ship.cells.length - 1].x + 1;
                let min_y = ship.cells[0].y - 1;
                let max_y = ship.cells[ship.cells.length - 1].y + 1;
                for (let y_i = min_y; y_i <= max_y; y_i++) {
                    for (let x_i = min_x; x_i <= max_x; x_i++) {
                        let cell = this.get_cell(x_i, y_i);
                        if (cell)
                            cell.obj.visible = true;
                    }
                }
            }
            ;
        }
    }
    hit(x, y, hit_bool) {
        let succsec = false;
        let cell = null;
        if (!this.hited_cells.some(cell => cell.x === x && cell.y === y)) {
            if (!hit_bool)
                this.hit_start();
            cell = this.get_cell(x, y);
            succsec = cell.succ;
            if (!succsec) {
                this.points_x.forEach(point_x => {
                    point_x.visible = false;
                });
                this.points_y.forEach(point_y => {
                    point_y.visible = false;
                });
            }
            let anim_x = this.cell_width / 2 + x * this.cell_width;
            let anim_y = this.cell_width / 2 + y * this.cell_width;
            if (hit_bool) {
                // this.check_ship(x,y);
                // cell.obj.visible = true;
                let anim = new Phaser.GameObjects.Sprite(this.scene, anim_x, anim_y, succsec ? 'explo_1' : 'splash_1');
                if (!succsec)
                    anim.scale = 0.7;
                anim.on('animationcomplete', () => {
                    this.check_ship(x, y);
                    cell.obj.visible = true;
                    anim.destroy;
                });
                this.add(anim);
                anim.play(succsec ? 'explo' : 'splash');
            }
            else {
                let projectile = new Phaser.GameObjects.Image(this.scene, anim_x, anim_y, 'projectile');
                projectile.setOrigin(1);
                this.add(projectile);
                this.scene.tweens.add({
                    targets: projectile,
                    scale: 0,
                    duration: 300,
                    onComplete: () => {
                        let anim = new Phaser.GameObjects.Sprite(this.scene, anim_x, anim_y, succsec ? 'explo_1' : 'splash_1');
                        if (!succsec)
                            anim.scale = 0.7;
                        anim.on('animationcomplete', () => {
                            this.hit_callback(succsec);
                            this.check_ship(x, y);
                            cell.obj.visible = true;
                            anim.destroy;
                        });
                        this.add(anim);
                        anim.play(succsec ? 'explo' : 'splash');
                    }
                });
            }
        }
        else {
            if (!hit_bool)
                this.hit_ignore();
            this.points_x.forEach(point_x => {
                point_x.visible = false;
            });
            this.points_y.forEach(point_y => {
                point_y.visible = false;
            });
        }
        return succsec;
    }
    fill_cells(game_scale, cell_width) {
        this.cells_imgs = [];
        let cell_img = 'cell_false';
        let cell_object;
        this.field.forEach((row, y) => {
            row.forEach((col, x) => {
                if (col === 1)
                    cell_img = 'cell_true';
                else
                    cell_img = 'cell_false';
                cell_object = new Phaser.GameObjects.Image(this.scene, cell_width / 2 + (cell_width * x), cell_width / 2 + (cell_width * y), cell_img);
                cell_object.setScale(cell_width / cell_object.width);
                cell_object.visible = false;
                this.all_cells_count++;
                this.cells_container.add(cell_object);
                this.cells_imgs.push({ obj: cell_object, x, y, succ: col === 1 });
            });
        });
    }
    fill_ships(game_scale, cell_width) {
        let ship;
        let vertical;
        let cells_ships = [];
        this.ships.forEach((ship_data, i) => {
            vertical = ship_data.y_l > ship_data.x_l;
            ship = new Phaser.GameObjects.Image(this.scene, cell_width / 2 + (ship_data.x * cell_width), cell_width / 2 + (ship_data.y * cell_width), 'ship_' + (vertical ? ship_data.y_l + 1 : ship_data.x_l + 1) + '_death');
            ship.scale = (cell_width * (vertical ? ship_data.y_l + 1 : ship_data.x_l + 1)) / ship.width;
            ship.setOrigin((cell_width / 2) / (ship.width * ship.scale), 0.5);
            ship.setAngle(vertical ? 90 : 0);
            cells_ships = [];
            for (let y_i = ship_data.y; y_i <= ship_data.y + ship_data.y_l; y_i++) {
                for (let x_i = ship_data.x; x_i <= ship_data.x + ship_data.x_l; x_i++) {
                    cells_ships.push({ x: x_i, y: y_i });
                }
            }
            this.all_ships_count++;
            ship.cells = cells_ships;
            ship.visible = false;
            this.ships_arr.push(ship);
            this.ships_container.add(ship);
        });
    }
    create_pointer(game_scale, cell_width) {
        this.setInteractive(new Phaser.Geom.Rectangle(0, 0, cell_width * 10, cell_width * 10), Phaser.Geom.Rectangle.Contains);
        this.points_x = [
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell')
        ];
        this.points_x.forEach((point_x, i) => {
            point_x.scale = cell_width / point_x.width;
            point_x.y = i * cell_width + cell_width / 2;
            point_x.alpha = 0.5;
            point_x.visible = false;
        });
        this.points_y = [
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell'),
            new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell')
        ];
        this.points_y.forEach((point_y, i) => {
            point_y.scale = cell_width / point_y.width;
            point_y.x = i * cell_width + cell_width / 2;
            point_y.alpha = 0.5;
            point_y.visible = false;
        });
        this.add(this.points_x);
        this.add(this.points_y);
        // this.point_cell = new Phaser.GameObjects.Image(this.scene, 0, 0, 'point_cell');
        // this.point_cell.alpha = 0;
        // this.point_cell.scale = game_scale;
        // this.point_cell.visible = false;
        // this.add(this.point_cell);
        // this.point_aim = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'Aim');
        // this.point_cell.scale = game_scale;
        // this.point_aim.visible = false;
        // this.add(this.point_aim);
        let point_cell_pos = { x: 0, y: 0 };
        let hit_pos = { x: 0, y: 0 };
        this.on('pointermove', (pointer) => {
            point_cell_pos.x = cell_width / 2 + Math.floor((pointer.x - this.x) / cell_width) * cell_width;
            point_cell_pos.y = cell_width / 2 + Math.floor((pointer.y - this.y) / cell_width) * cell_width;
            // this.point_cell.setPosition(point_cell_pos.x, point_cell_pos.y);
            this.points_x.forEach(point_x => {
                point_x.x = point_cell_pos.x;
            });
            this.points_y.forEach(point_y => {
                point_y.y = point_cell_pos.y;
            });
            // this.point_aim.setPosition(pointer.x - this.x, pointer.y - this.y);
        });
        this.on('pointerover', (pointer) => {
            this.over_cell = true;
            if (this.turn) {
                // this.point_cell.visible = pointer.isDown;
                this.points_x.forEach(point_x => {
                    point_x.visible = pointer.isDown;
                });
                this.points_y.forEach(point_y => {
                    point_y.visible = pointer.isDown;
                });
                // this.point_aim.visible = pointer.isDown;
            }
        });
        this.on('pointerout', (pointer) => {
            this.over_cell = false;
            if (this.turn) {
                // this.point_cell.visible = false;
                this.points_x.forEach(point_x => {
                    point_x.visible = false;
                });
                this.points_y.forEach(point_y => {
                    point_y.visible = false;
                });
                // this.point_aim.visible = false;
            }
        });
        this.on('pointerdown', (pointer) => {
            if (this.turn) {
                // this.point_cell.visible = this.over_cell;
                this.points_x.forEach(point_x => {
                    point_x.visible = this.over_cell;
                });
                this.points_y.forEach(point_y => {
                    point_y.visible = this.over_cell;
                });
                // this.point_aim.visible = this.over_cell;
            }
        });
        this.on('pointerup', (pointer) => {
            if (this.turn) {
                // this.point_cell.visible = false;
                this.points_x.forEach(point_x => {
                    point_x.visible = false;
                });
                this.points_y.forEach(point_y => {
                    point_y.visible = false;
                });
                // this.point_aim.visible = false;
                hit_pos.x = Math.floor((pointer.x - this.x) / cell_width);
                hit_pos.y = Math.floor((pointer.y - this.y) / cell_width);
                this.hit(hit_pos.x, hit_pos.y);
            }
        });
    }
    init(params) {
        this.x = params.x;
        this.y = params.y;
        let game_scale = 1;
        let cell_width = global_data.cell_width * game_scale + 2;
        this.cell_width = cell_width;
        this.field = params.field;
        this.ships = params.ships;
        this.hit_callback = params.hit_callback;
        this.hit_start = params.hit_start;
        this.hit_ignore = params.hit_ignore;
        this.ships_arr = [];
        this.all_cells_count = 0;
        this.hited_cells_count = 0;
        this.all_ships_count = 0;
        this.hited_ships_count = 0;
        this.hited_cells = [];
        this.ships_container = new Phaser.GameObjects.Container(this.scene);
        this.add(this.ships_container);
        this.cells_container = new Phaser.GameObjects.Container(this.scene);
        this.add(this.cells_container);
        this.fill_ships(game_scale, cell_width);
        this.fill_cells(game_scale, cell_width);
        this.create_pointer(game_scale, cell_width);
        // this.point = new Phaser.GameObjects.Image(this.scene, 0, 0, 'common1', 'Aim');
    }
}
