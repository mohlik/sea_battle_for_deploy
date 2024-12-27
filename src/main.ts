let game: Phaser.Game;
let game_size = {
    width: 0,
    height: 0
};
let global_data = {
    'user_data': {
        'name': 'Player',
        'rank': {
            'stage': 'sergant',
            'score': 0
        },
        'coins': 0,
        'gems': 0,
        'statistic': {
            'wins': 0,
            'loses': 0
        },
        'lang': 'en_US',
        'game_syles': {
            'ships': 'default',
            'ava': 'default',
            'frame': 'default',
            'bg': 'default'
        }
    },

    'game_play': {
		'with_bot': true,
		'fields': [],
		'default_rules': {
			'ships': {
				'boats': [
					4,
					3,
					2,
					1
				],
				'bombs': 0
			},
			'filling': 20
		}
	}
}
let game_container: Game;

class Boot extends Phaser.Scene {
    loader: LoaderBar

    constructor() {
        super('Boot');
    }

    preload() {
        this.load.script('loader_bar', 'js/components/loader_bar.js');
        this.load.image('loading_bg', 'public/assets/preload/loading_bg.png');
        this.load.image('loader_bg', 'public/assets/preload/loader_bg.png');
        this.load.image('loader_bar', 'public/assets/preload/loader_bar.png');
        this.load.once('complete', this.create_loader, this);
    }

    create_loader() {

        let bg = this.add.image(0, 0, 'loading_bg');
        bg.setOrigin(0, 0);
        bg.setScale(
            game_size.width / bg.width,
            game_size.height / bg.height
        );

        this.loader = new LoaderBar(this, {
            frame_bar: 'loader_bar',
            frame_bg: 'loader_bg'
        });
        this.loader.x = game_size.width / 2;
        this.loader.y = game_size.height / 2;
        this.add.existing(this.loader);
        this.load.once('complete', () => {
            bg.destroy();
            this.loader.destroy();
            this.create_game();
        });
        this.preload_files();
    }

    preload_files() {
        this.load.on('progress', (value: number) => {
            this.loader.update_progress(value);
        });

        this.load.pack('assets_pack', 'public/assets_pack.json', 'images');

        this.load.json('map_items', 'public/assets/data/map_items.json');
        
        this.load.scripts('main', [
            'js/game.js',
            'js/scenes/game_menu.js',
            'js/scenes/game_play.js',

            'js/game_play/game_engine/prepare_frame.js',
            'js/game_play/game_engine/game_field.js',
            'js/game_play/game_engine/bot.js',

            'js/game_play/game_play.js',
            'js/game_play/prepare_field.js',

            'js/game_map/game_map.js',
            'js/game_map/map_item.js',

            'js/components/custom_button.js',
            'js/components/custom_text.js',

            'js/managers/language_manager.js',
            'js/managers/windows_manager.js',

            'js/windows/test_window.js',
        ]);

        this.load.start();
    }

    create_game() {
        game_container = new Game(this);
        this.add.existing(game_container);
        game_container.init();
    }

}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'phaser_game',
    backgroundColor: '#111111',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: [
        Boot
    ]
};
game = new Phaser.Game(config);
game_size.width = window.innerWidth;
game_size.height = window.innerHeight;
