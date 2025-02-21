class Game extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
    }
    init_flags() {
        global_data['flags'] = Object.keys(this.scene.textures.get('flags').frames).filter(e => e !== '__BASE');
        console.log(global_data['flags']);
    }
    create_dark() {
        this.dark = new Phaser.GameObjects.Graphics(this.scene);
        this.dark.fillStyle(0x23232F, 0.6);
        this.dark.fillRect(0, 0, game_size.width, game_size.height);
        this.dark.setInteractive(new Phaser.Geom.Rectangle(0, 0, game_size.width, game_size.height), Phaser.Geom.Rectangle.Contains);
        this.dark.on('pointerup', () => {
            if (this.windows_manager.window && this.windows_manager.window.handler_close)
                this.windows_manager.window.handler_close();
            else
                this.windows_manager.close_window();
        });
        this.dark.alpha = 0;
        this.add(this.dark);
    }
    init() {
        this.init_flags();
        this.anims_manager = new AnimsManager(this.scene);
        this.add(this.anims_manager);
        // this.anims_manager.get_big_window_move_anim(this);
        this.language_manager = new LanguageManager(this.scene);
        this.game_menu = new GameMenu(this.scene);
        this.add(this.game_menu);
        this.game_play = new GamePlay(this.scene);
        this.add(this.game_play);
        this.big_windows = new BigWindows(this.scene);
        this.add(this.big_windows);
        this.create_dark();
        this.windows_manager = new WindowsManager(this.scene);
        this.add(this.windows_manager);
        this.update_scenes('game_menu');
    }
    update_scenes(scene_id) {
        const condition = {
            'game_menu': this.game_menu,
            'game_play': this.game_play,
            'big_windows': this.big_windows,
        };
        let _visible = false;
        Object.keys(condition).forEach((condition_key) => {
            if (condition_key === scene_id)
                _visible = true;
            else
                _visible = false;
            if (condition[condition_key])
                condition[condition_key].visible = _visible;
        });
    }
    to_local_pt(container, pt) {
        var containers = [];
        var parent_contaiter = container;
        var holder;
        if (pt)
            var new_pt = new Phaser.Geom.Point(pt.x, pt.y);
        else
            var new_pt = new Phaser.Geom.Point(0, 0);
        while (parent_contaiter && parent_contaiter != this.scene) {
            containers.push(parent_contaiter);
            parent_contaiter = parent_contaiter.parentContainer;
        }
        while (containers.length > 0) {
            holder = containers.pop();
            new_pt.x = (new_pt.x - holder.x) / holder.scaleX;
            new_pt.y = (new_pt.y - holder.y) / holder.scaleY;
        }
        return new_pt;
    }
    to_global_pt(container, pt) {
        if (pt)
            var new_pt = new Phaser.Geom.Point(pt.x, pt.y);
        else
            var new_pt = new Phaser.Geom.Point(0, 0);
        var parent_contaiter = container;
        while (parent_contaiter && parent_contaiter != this.scene) {
            new_pt.x = new_pt.x * parent_contaiter.scaleX + parent_contaiter.x;
            new_pt.y = new_pt.y * parent_contaiter.scaleY + parent_contaiter.y;
            parent_contaiter = parent_contaiter.parentContainer;
            console.trace(new_pt, parent_contaiter);
        }
        return new_pt;
    }
}
