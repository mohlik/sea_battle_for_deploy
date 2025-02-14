class SliderBanner extends Phaser.GameObjects.Container {
    constructor(scene, params) {
        super(scene);
        this.scene = scene;
        this.init(params);
    }
    init(params) {
        let prev_y;
        if (params.background)
            this.background = new Phaser.GameObjects.Image(this.scene, 0, 0, params.background.texture ? params.background.texture : params.background.frame, params.background.texture ? params.background.frame : null).setOrigin(0.5);
        else {
            this.background = new Phaser.GameObjects.Rectangle(this.scene, 0, 0, params.width, params.height, 0xffffff, 0);
        }
        if (params.scale)
            this.background.setScale(params.scale.x, params.scale.y);
        if (params.tint)
            this.background.setTint(params.tint);
        this.container = new Phaser.GameObjects.Container(this.scene);
        this.add([this.background, this.container]);
        this.minus_y = (this.background.getBounds().height / 2) * 0.95 - 20;
        this.minus_x = (this.background.getBounds().width / 2) * 0.95;
        const { width, height } = this.background;
        this.setSize(width, height);
        this.setInteractive();
        this.max_y = this.get_max_y() + 20;
        this.was_move = false;
        this.pointer_down = false;
        this
            .on('pointerdown', () => {
            this.pointer_down = true;
        })
            .on('pointerup', () => {
            this.pointer_down = false;
            this.was_move = false;
        })
            .on('pointerout', () => {
            this.pointer_down = false;
            this.was_move = false;
        })
            .on('pointermove', (pointer) => {
            if (this.pointer_down) {
                this.was_move = true;
                this.updateScroll(pointer.position.y - pointer.prevPosition.y);
            }
        })
            .on('wheel', (pointer, dragX, dragY) => {
            this.updateScroll(-dragY * 0.3);
        });
    }
    updateScroll(deltaY) {
        const new_y = this.container.y + deltaY;
        if (new_y < -this.minus_y && new_y > -(this.max_y)) {
            this.container.y = new_y;
        }
        else if (new_y > -(this.max_y - this.minus_y)) {
            this.container.y = -this.minus_y;
        }
        else if (new_y < -this.minus_y) {
            this.container.y = -(this.max_y);
        }
        this.emit('scrollProgress', this.getScrollProgress());
    }
    get_max_y() {
        const childs = [];
        const get_from_list = (container, tree = []) => {
            container.list.forEach(e => {
                if (e.type === 'Container') {
                    tree.push(e);
                    get_from_list(e, tree);
                }
                else {
                    childs.push(e.y + e.getBounds().height * 1.5 + tree.reduce((sum, a) => sum + a.y, 0));
                }
            });
        };
        get_from_list(this);
        return Math.max(...childs);
    }
    get_childs() {
        const childs = [];
        const get_from_list = (container) => {
            container.list.forEach(e => {
                if (e.type === 'Container') {
                    get_from_list(e);
                }
                else {
                    childs.push(e);
                }
            });
        };
        get_from_list(this);
        return childs;
    }
    get_last() {
        const childs = this.get_childs();
        return childs[childs.map(e => e.y).indexOf(Math.max(...childs.map(e => e.y)))];
    }
    get_min_max_coords() {
        const childs = this.get_childs();
        const first_elem = childs[childs.map(e => e.y).indexOf(Math.min(...childs.map(e => e.y)))];
        const last_elem = childs[childs.map(e => e.y).indexOf(Math.max(...childs.map(e => e.y)))];
        const min = first_elem.y - first_elem.getBounds().height / 2;
        const max = last_elem.y + last_elem.getBounds().height / 2;
        return { min, max };
    }
    setXY(x, y, x1, y1) {
        this.x = x;
        this.y = y;
        this.rect_mask = new Phaser.GameObjects.Rectangle(this.scene, x1 ? x1 : x, y1 ? y1 : y, this.background.width, this.background.height, 0x000000, 1); //.setScale(this.background.scaleX * 0.98, this.background.scaleY * 0.98);
        this.temp_mask = this.rect_mask.createGeometryMask();
        this.container.mask = this.temp_mask;
        this.container.setPosition(-this.minus_x, -this.minus_y);
    }
    add_child(child, max_y) {
        this.container.add(child);
        this.max_y = this.get_max_y() + (max_y ? max_y : 20);
    }
    replace_child(from, to) {
        this.container.replace(from, to);
        this.max_y = this.get_max_y() + 20;
    }
    getScrollProgress() {
        const minScroll = -this.minus_y;
        const maxScroll = -(this.max_y);
        return (this.container.y - maxScroll) / (minScroll - maxScroll);
    }
}
