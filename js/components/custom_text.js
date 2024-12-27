class CustomText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style, text_id) {
        super(scene, x, y, text, style);
        this.lang = '';
        this.add_to_global_texts(text_id);
    }
    add_to_global_texts(text_id) {
        game_container.language_manager.add_text(this, text_id);
    }
}
