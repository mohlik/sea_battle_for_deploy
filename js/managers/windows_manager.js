class WindowsManager extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.pending_widows = [];
        this.window = null;
        this.create_window_table();
    }
    create_window_table() {
        this.window_table = {
            'test': BasicWindow,
            'result_battle': ResultBattleWindow,
            'quit_battle': QuitBattleWindow,
            'save_field': SaveFieldWindow,
            'arsenal': ArsenalWindow,
            'video_oil': VideoOilWindow,
            'arena_slider': ArenaSlidereWindow,
            'daily_reward': DailyRewardWindow,
            'options': OptionsWindow,
        };
    }
    show_window(window_id, params) {
        let new_window = false;
        let current_window_id = window_id;
        let current_params = params;
        if (!this.window && this.pending_widows.length === 0 && (current_window_id in this.window_table)) {
            this.window = new this.window_table[current_window_id](this.scene);
            new_window = true;
        }
        else if (!this.window) {
            let { window_id, params } = this.pending_widows.shift();
            current_window_id = window_id;
            current_params = params;
            this.window = new this.window_table[current_window_id](this.scene);
            new_window = true;
        }
        else {
            this.pending_widows.push({
                window_id,
                current_params
            });
        }
        if (new_window) {
            this.window.x = game_size.width / 2;
            this.window.y = -game_size.height / 2;
            this.add(this.window);
            this.window.init();
            this.window.pre_show(current_params);
            this.anim_pos_window(game_size.height / 2, () => {
                this.window.post_show();
            });
        }
    }
    anim_pos_window(y, on_complete) {
        let ease = y > game_size.height / 2 ? 'back.in' : 'back.out';
        // let ease = 'linear';
        let duration = 400;
        this.scene.tweens.add({
            // targets: this.window.outer_objects ? [this.window, ...this.window.outer_objects] : this.window,
            targets: this.window,
            y,
            duration,
            ease,
            onComplete: () => on_complete()
        });
        if (this.window.outer_objects) {
            this.window.outer_objects.forEach(outer_object => {
                this.scene.tweens.add({
                    targets: this.window.outer_objects,
                    y: y <= game_size.height / 2 ?
                        y - game_size.height / 2 - outer_object.y :
                        y,
                    duration,
                    ease
                });
            });
        }
        this.scene.tweens.add({
            targets: game_container.dark,
            alpha: y > game_size.height / 2 ? 0 : 1,
            duration: 300
        });
    }
    close_window() {
        this.anim_pos_window(game_size.height * 1.5, () => {
            if (this.window)
                this.window.destroy();
            this.window = null;
            if (this.pending_widows.length > 0)
                this.show_window();
        });
    }
}
