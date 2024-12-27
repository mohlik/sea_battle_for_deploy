class Bot {
    field: Field
    old_points: any
    ship_length: number
    ship_points: any

    constructor(field: Field) {
        this.field = field;
        this.old_points = [];
        this.ship_points = [];
        this.ship_length = 0;
    }

    get_random_point(): {
        x: number,
        y: number
    } {
        return {
            x: Phaser.Math.Between(0, 9),
            y: Phaser.Math.Between(0, 9)
        }
    }

    get_ship(x: number, y: number) {
        let ship_cells = [];
        const get_neighbour = (x: number, y: number) => {
            ship_cells.push({x,y});
            if(this.field?.[y-1]?.[x] === 1 && !ship_cells.some(e => e.x === x && e.y === y - 1)) get_neighbour(x, y-1);
            if(this.field?.[y]?.[x-1] === 1 && !ship_cells.some(e => e.x === x - 1 && e.y === y)) get_neighbour(x-1, y);
            if(this.field?.[y+1]?.[x] === 1 && !ship_cells.some(e => e.x === x && e.y === y + 1)) get_neighbour(x, y+1);
            if(this.field?.[y]?.[x+1] === 1 && !ship_cells.some(e => e.x === x + 1 && e.y === y)) get_neighbour(x+1, y);
        }
        get_neighbour(x, y);
        return ship_cells.length
    }

    set_death_ship() {
        let x_min = 9;
        let x_max = 0;
        let y_min = 9;
        let y_max = 0;

        this.ship_points.forEach(ship_point => {
            if(x_min > ship_point.x) x_min = ship_point.x;
            if(x_max < ship_point.x) x_max = ship_point.x;
            if(y_min > ship_point.y) y_min = ship_point.y;
            if(y_max < ship_point.y) y_max = ship_point.y;
        });

        for(let y = y_min - 1; y <= y_max + 1; y++) {
            for(let x = x_min - 1; x <= x_max + 1; x++) {
                this.old_points.push({x, y});
            }
        }
    }

    turn() {
        let current_point: {
            x: number,
            y: number
        };
        if(this.ship_points.length === 0) {
            current_point = this.get_random_point();
            if(!this.old_points.some(old_point => old_point.x === current_point.x && old_point.y === current_point.y)) {
                this.old_points.push(current_point);
                if(this.field[current_point.y][current_point.x] === 1) {
                    this.ship_length = this.get_ship(current_point.x, current_point.y);
                    this.ship_points.push({...current_point});
                    if(this.ship_length <= this.ship_points.length) {
                        this.ship_length = 0;
                        this.ship_points = [];
                    }
                }
                return current_point;
            } else {
                return this.turn();
            }
        } else if(this.ship_points.length === 1) {
            current_point = {...this.ship_points[0]};
            if(Math.random() > 0.5) {
                current_point.y += Math.random() > 0.5 ? 1 : -1;
            } else {
                current_point.x += Math.random() > 0.5 ? 1 : -1;
            }
            if((this.field?.[current_point.y]?.[current_point.x] === 0 || this.field?.[current_point.y]?.[current_point.x] === 1) &&
                !this.old_points.some(old_point => old_point.x === current_point.x && old_point.y === current_point.y)) {
                this.old_points.push(current_point);
                if(this.field[current_point.y][current_point.x] === 1) {
                    this.ship_points.push({...current_point});
                    if(this.ship_length <= this.ship_points.length) {
                        this.set_death_ship();
                        this.ship_length = 0;
                        this.ship_points = [];
                    }
                }
                return current_point;
            } else {
                return this.turn();
            }
        } else if (this.ship_points.length > 1) {
            let x_min = 9;
            let x_max = 0;
            let y_min = 9;
            let y_max = 0;
            console.log(this.ship_points);

            this.ship_points.forEach(ship_point => {
                if(x_min > ship_point.x) x_min = ship_point.x;
                if(x_max < ship_point.x) x_max = ship_point.x;
                if(y_min > ship_point.y) y_min = ship_point.y;
                if(y_max < ship_point.y) y_max = ship_point.y;
            });

            if(x_min === x_max) {
                current_point = {
                    x: x_min,
                    y: Math.random() > 0.5 ? y_min - 1 : y_max + 1
                }
            } else {
                current_point = {
                    x: Math.random() > 0.5 ? x_min - 1 : x_max + 1,
                    y: y_min
                }
            }   
            console.log(current_point);
            if((this.field?.[current_point.y]?.[current_point.x] === 0 || this.field?.[current_point.y]?.[current_point.x] === 1) &&
                !this.old_points.some(old_point => old_point.x === current_point.x && old_point.y === current_point.y)) {
                this.old_points.push(current_point);
                if(this.field[current_point.y][current_point.x] === 1) {
                    this.ship_points.push({...current_point});
                    if(this.ship_length <= this.ship_points.length) {
                        this.set_death_ship();
                        this.ship_length = 0;
                        this.ship_points = [];
                    }
                }
                return current_point;
            } else {
                return this.turn();
            }
        }
    }
}