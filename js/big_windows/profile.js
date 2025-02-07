class Profile extends Phaser.GameObjects.Container {
    constructor(scene) {
        super(scene);
        this.init();
    }
    init() {
        this.create_static_images();
        this.create_texts();
        this.create_rank_bar();
        this.cerate_interactive_images();
    }
    show() {
    }
    create_static_images() {
        let cell_width = global_data.cell_width;
        let temp;
        temp = new Phaser.GameObjects.Image(this.scene, 7.5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(1.02, 0.98);
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 21.5 * cell_width, 3.5 * cell_width, 'new', 'plank');
        temp.setScale(1.02, 0.98);
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 7.5 * cell_width, 14.5 * cell_width, 'new', 'plank');
        temp.setScale(1.02, 0.98);
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 18.5 * cell_width, 12.5 * cell_width, 'new', 'plank');
        temp.setScale(0.46, 0.98);
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 24.5 * cell_width, 12.5 * cell_width, 'new', 'plank');
        temp.setScale(0.46, 0.98);
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 7.5 * cell_width, 10 * cell_width, 'new', 'name_back');
        this.add(temp);
        let graphics = new Phaser.GameObjects.Graphics(this.scene);
        graphics.lineStyle(7, 0x051F79, 1);
        graphics.lineBetween(15 * cell_width, 3 * cell_width + 3.5, 15 * cell_width, game_size.height);
        graphics.lineStyle(7, 0xCF4038, 1);
        graphics.lineBetween(16 * cell_width, 5 * cell_width, 27 * cell_width, 5 * cell_width);
        graphics.lineBetween(16 * cell_width, 11 * cell_width, 27 * cell_width, 11 * cell_width);
        this.add(graphics);
    }
    create_texts() {
        let cell_width = global_data.cell_width;
        let text;
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 7.5, cell_width * 3.5, 'INFORMATION', { fontFamily: 'rubik', fontSize: 36, color: '#ffffff' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 7.5, cell_width * 14.5, 'UKRAINE', { fontFamily: 'rubik', fontSize: 36, color: '#ffffff' });
        text.setOrigin(0.5);
        text.setInteractive();
        text.on('pointerup', () => {
            this.handler_edit_flag();
        });
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 21.5, cell_width * 3.5, 'STATISTICS', { fontFamily: 'rubik', fontSize: 36, color: '#ffffff' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 21.5, cell_width * 4.5, 'FIGHTER STATISTIC', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 21.5, cell_width * 11.5, 'MODE BATTLE STATISTIC', { fontFamily: 'rubik', fontSize: 28, color: '#051F79' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 18.5 * cell_width, 12.5 * cell_width, 'CLASSIC', { fontFamily: 'rubik', fontSize: 28, color: '#ffffff' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, 24.5 * cell_width, 12.5 * cell_width, 'ADVANCED', { fontFamily: 'rubik', fontSize: 28, color: '#ffffff' });
        text.setOrigin(0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 5.5, 'SHIP SUNK:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 6.5, 'CONSECUTIVE VICTORIES:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 7.5, 'PERFECT VICTORIES:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 8.5, 'VICTORIES IN TOURNAMENTS:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 9.5, 'ADMIRALS DEFEATED:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 10.5, 'FEET ADMIRALS DEFEATED:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 5.5, '89', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 6.5, '19', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 7.5, '9', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 8.5, '9', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 9.5, '92', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 10.5, '32', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16 + 5, cell_width * 13.5, 'BATTLES:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 21 - 5, cell_width * 13.5, '999', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 16, cell_width * 14.5, 'W:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 18.35, cell_width * 14.5, '99%', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 18.8, cell_width * 14.5, 'L:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 21, cell_width * 14.5, '1%', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 22 + 5, cell_width * 13.5, 'BATTLES:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27 - 5, cell_width * 13.5, '999', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 22, cell_width * 14.5, 'W:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 24.35, cell_width * 14.5, '0%', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 24.8, cell_width * 14.5, 'L:', { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 27, cell_width * 14.5, '100%', { fontFamily: 'rubik', fontSize: 40, color: '#DF2C2A' });
        text.setOrigin(1, 0.5);
        this.add(text);
        text = new Phaser.GameObjects.Text(this.scene, cell_width * 7.5, cell_width * 9.7, global_data.user_data.name.toUpperCase(), { fontFamily: 'rubik', fontSize: 36, color: '#051F79' });
        text.setOrigin(0.5);
        text.setInteractive();
        text.on('pointerup', () => {
            this.handler_edit_name();
        });
        this.add(text);
    }
    create_rank_bar() {
        let cell_width = global_data.cell_width;
        let temp;
        this.rank_bar = new LoaderBar(this.scene, {
            atlas: 'new',
            frame_bg: 'plank',
            frame_bar: 'oil_progress'
        });
        this.rank_bar.bg.setScale(0.73, 1);
        this.rank_bar.update_progress(global_data.user_data.rank.score / global_data.user_data.rank.to_up);
        this.rank_bar.setPosition(7.5 * cell_width, 11.5 * cell_width);
        this.rank_bar.setScale(0.9, 1);
        this.add(this.rank_bar);
        temp = new Phaser.GameObjects.Image(this.scene, 3.5 * cell_width + 2, 11.5 * cell_width + 3, 'new', 'rank_micro');
        temp.scale = 1.6;
        this.add(temp);
        this.rank_bar_txt = new Phaser.GameObjects.Text(this.scene, 7.5 * cell_width, 11.5 * cell_width, `${global_data.user_data.rank.score}/${global_data.user_data.rank.to_up}`, { fontFamily: 'rubik', fontSize: 36, strokeThickness: 4, stroke: '#072279' });
        this.rank_bar_txt.setOrigin(0.5, 0.5);
        this.add(this.rank_bar_txt);
    }
    cerate_interactive_images() {
        let cell_width = global_data.cell_width;
        let temp;
        temp = new Phaser.GameObjects.Image(this.scene, 7.5 * cell_width, 6.6 * cell_width, 'new', 'profile_ava');
        temp.scale = 1.3;
        temp.setInteractive();
        temp.on('pointerup', () => {
            this.handler_edit_ava();
        });
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 12 * cell_width, 4.5 * cell_width, 'new', 'edit_icon');
        temp.setInteractive();
        temp.on('pointerup', () => {
            this.handler_edit_ava();
        });
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 12 * cell_width, 9.9 * cell_width, 'new', 'edit_icon');
        temp.setInteractive();
        temp.on('pointerup', () => {
            this.handler_edit_name();
        });
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 7.5 * cell_width, 13.1 * cell_width, 'new', 'edit_flag');
        temp.setInteractive();
        temp.on('pointerup', () => {
            this.handler_edit_flag();
        });
        this.add(temp);
        temp = new Phaser.GameObjects.Image(this.scene, 11.1 * cell_width, 11.5 * cell_width + 3, 'new', 'info_button');
        temp.setInteractive();
        temp.on('pointerup', () => {
            this.handler_rank_info();
        });
        this.add(temp);
    }
    handler_rank_info() {
    }
    handler_edit_ava() {
        game_container.big_windows.update_scenes('personalization');
    }
    handler_edit_name() {
    }
    handler_edit_flag() {
        game_container.big_windows.update_scenes('personalization');
    }
    handler_close() {
    }
}
