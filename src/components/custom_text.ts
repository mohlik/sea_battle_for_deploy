class CustomText extends Phaser.GameObjects.Text {
    lang: string

    constructor(scene: Phaser.Scene, x: number, y: number, text: string, style: any, text_id: string) {
        super(scene, x, y, text, style);
        this.lang = '';
        this.add_to_global_texts(text_id);
    }

    add_to_global_texts(text_id: string): void {
        game_container.language_manager.add_text(this, text_id);
    }
}