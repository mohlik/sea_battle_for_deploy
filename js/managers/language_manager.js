class LanguageManager {
    constructor(scene) {
        this.scene = scene;
        this.lang = this.get_user_lang();
        this.global_texts = [];
        this.loaded_languages = {};
        this.load_lang(() => {
            this.update_texts();
        });
    }
    load_lang(on_complete) {
        if (!(this.lang in this.loaded_languages)) {
            this.scene.load.json(this.lang, 'public/assets/lang/' + this.lang + '.json');
            this.scene.load.once('complete', () => {
                this.loaded_languages[this.lang] = true;
                on_complete();
            });
            this.scene.load.start();
        }
        else {
            on_complete();
        }
    }
    set_language(val) {
        this.lang = val;
        this.load_lang(() => {
            this.update_user_lang();
            this.update_texts();
        });
    }
    get_user_lang() {
        return 'en_US'; // server
    }
    update_user_lang() {
        console.log('to server', this.lang);
    }
    get_text_for_id(text_id) {
        let lang_table;
        if (this.lang in this.loaded_languages) {
            lang_table = this.scene.cache.json.get(this.lang);
        }
        else {
            this.load_lang(() => {
                lang_table = this.scene.cache.json.get(this.lang);
            });
        }
        return lang_table[text_id];
    }
    update_text(text_obj) {
        let obj_from_json;
        if (text_obj.text_object.lang !== this.lang) {
            obj_from_json = this.get_text_for_id(text_obj.text_id);
            text_obj.text_object.lang = this.lang;
            text_obj.text_object.setText(obj_from_json.text);
            text_obj.text_object.setStyle(obj_from_json.style);
        }
    }
    update_texts() {
        this.global_texts.forEach((text_obj) => {
            this.update_text(text_obj);
        });
    }
    add_text(obj, text_id) {
        let text_obj = {
            text_object: obj,
            text_id
        };
        this.global_texts.push(text_obj);
        this.update_text(text_obj);
    }
}
