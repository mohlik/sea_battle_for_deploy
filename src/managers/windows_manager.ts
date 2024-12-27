class WindowsManager extends Phaser.GameObjects.Container {
    window: BasicWindow
    pending_widows: any
    window_table: any;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.init();
    }

    init(): void {
        this.pending_widows = [];
        this.window = null;
        this.create_window_table();
    }   

    create_window_table(): void {
        this.window_table = {
            'test': BasicWindow 
        }
    }

    show_window(window_id?: string, params?: any): void {
        let new_window: boolean = false;
        let current_window_id: string = window_id;
        let current_params: any = params;
        if(!this.window && this.pending_widows.length === 0 && (current_window_id in this.window_table)) {
            this.window = new this.window_table[current_window_id](this.scene);
            new_window = true;
        } else if (!this.window) {
            let {window_id, params} = this.pending_widows.shift();
            current_window_id = window_id;
            current_params = params;
            this.window = new this.window_table[current_window_id](this.scene);
            new_window = true;
        } else {
            this.pending_widows.push({
                window_id,
                current_params
            });
        }

        if(new_window) {
            this.window.x = game_size.width / 2;
            this.window.y = -game_size.height / 2;
            this.add(this.window);
            this.window.pre_show(current_params);
            this.anim_pos_window(game_size.height / 2, () => {
                this.window.post_show();
            });
        }
    }

    anim_pos_window(y: number, on_complete: Function): void {
        this.scene.tweens.add({
            targets: this.window,
            y,
            duration: 400,
            ease: y > game_size.height / 2 ? 'back.in' : 'back.out',
            onComplete: () => on_complete()
        });
    }

    close_window() {
        this.anim_pos_window(game_size.height * 1.5, () => {
            this.window.destroy();
            this.window = null;
            if(this.pending_widows.length > 0) this.show_window();
        });
    }
}