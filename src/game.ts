class Game extends Phaser.GameObjects.Container {
    main_background: Phaser.GameObjects.Image
    game_menu: GameMenu
    game_play: GamePlay
    language_manager: LanguageManager
    windows_manager: WindowsManager

    constructor(scene: Phaser.Scene) {
        super(scene);
    }

    init(): void {

        this.language_manager = new LanguageManager(this.scene);
        this.game_menu = new GameMenu(this.scene);
        this.add(this.game_menu);

        this.game_play = new GamePlay(this.scene);
        this.add(this.game_play);

        this.windows_manager = new WindowsManager(this.scene);
        this.add(this.windows_manager);
        this.update_scenes('game_menu');
    }

    update_scenes(scene_id: string): void {
        const condition = {
            'game_menu': this.game_menu,
            'game_play': this.game_play,
        }
        let _visible: boolean = false;
        Object.keys(condition).forEach((condition_key: string) => {
            if (condition_key === scene_id) _visible = true;
            else _visible = false;
            if(condition[condition_key]) condition[condition_key].visible = _visible;
        });
    }
}