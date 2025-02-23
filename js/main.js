let game;
let game_size = {
    width: 0,
    height: 0
};
let text_styles = {
    default: {
        fontFamily: 'font1',
        fontSize: '24',
        color: '#ffffff'
    }
};
let global_data = {
    'cell_width': 67,
    'user_data': {
        'name': 'Player',
        'rank': {
            'stage': 'sergant',
            'score': 890,
            'to_up': 1000
        },
        rating: {
            score: 999
        },
        'coins': 0,
        'gems': 0,
        'oil': {
            'amount': 1000,
            'max': 1000
        },
        'daily_reward': {
            amount: 0
        },
        skills: {
            'atom': {
                amount: 0
            },
            'bomber': {
                amount: 0
            },
            'fighter': {
                amount: 0
            },
            'torpedo': {
                amount: 0
            },
            'submarine': {
                amount: 0
            },
            'radar': {
                amount: 0
            },
            'airdef': {
                amount: 0
            },
            'mine': {
                amount: 0
            }
        },
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
        },
        'flag': 'UA',
        'personalization': {
            'avatars': [
                'default',
                'default',
                'default',
                'default',
                'default',
                'default',
                'default',
                'default',
            ],
            'frames': [
                'default',
                'default',
                'default',
                'default',
                'default',
                'default',
                'default',
                'default',
            ],
            'feet': [
                'default',
                'default'
            ],
            'backgrounds': [
                'default',
                'default'
            ]
        }
    },
    "personalization_data": {
        avatars: {
            default: {
                src: '',
                atlas: '',
                frame: ''
            }
        }
    },
    'shop': {
        'personalization': {
            'avatars': [
                { 'type': 'avatar', 'price': 100, 'valute': 'gold' }
            ]
        },
        purchase_items: [
            { type: 'coins', id: 'coin_1', price: 0.99, icon: 'coin_1', items: {
                    money: 200
                } },
            { type: 'coins', id: 'coin_2', price: 1.99, icon: 'coin_2', items: {
                    money: 500
                } },
            { type: 'coins', id: 'coin_3', price: 2.99, icon: 'coin_3', items: {
                    money: 1100
                } },
            { type: 'coins', id: 'coin_4', price: 3.99, icon: 'coin_4', items: {
                    money: 2500
                } },
            { type: 'coins', id: 'coin_5', price: 4.99, icon: 'coin_5', items: {
                    money: 7000
                } },
            { type: 'gems', id: 'gem_1', price: 0.99, icon: 'gem_1', items: {
                    gems: 50
                } },
            { type: 'gems', id: 'gem_2', price: 1.99, icon: 'gem_2', items: {
                    gems: 110
                } },
            { type: 'gems', id: 'gem_3', price: 2.99, icon: 'gem_3', items: {
                    gems: 250
                } },
            { type: 'gems', id: 'gem_4', price: 3.99, icon: 'gem_4', items: {
                    gems: 600
                } },
            { type: 'gems', id: 'gem_5', price: 4.99, icon: 'gem_5', items: {
                    gems: 1500
                } },
        ]
    },
    'game_play': {
        'with_bot': true,
        'advanced': true,
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
    },
    'skills': {
        'atom': {
            price: 300,
            max: 1
        },
        'bomber': {
            price: 200,
            max: 2
        },
        'fighter': {
            price: 150,
            max: 3
        },
        'torpedo': {
            price: 150,
            max: 2
        },
        'submarine': {
            price: 200,
            max: 2
        },
        'radar': {
            price: 150,
            max: 1
        },
        'airdef': {
            price: 120,
            max: 3
        },
        'mine': {
            price: 50,
            max: 4
        }
    },
    daily_rewards: [
        { type: 'coins', amount: 100, icon: 'coin_1' },
        { type: 'coins', amount: 200, icon: 'coin_1' },
        { type: 'coins', amount: 300, icon: 'coin_1' },
        { type: 'coins', amount: 400, icon: 'coin_1' },
        { type: 'coins', amount: 500, icon: 'coin_1' },
        { type: 'coins', amount: 600, icon: 'coin_1' },
        { type: 'coins', amount: 700, icon: 'coin_1' },
        { type: 'coins', amount: 800, icon: 'coin_1' },
        { type: 'coins', amount: 900, icon: 'coin_1' },
        { type: 'coins', amount: 1000, icon: 'coin_1' },
        { type: 'coins', amount: 1100, icon: 'coin_1' },
        { type: 'coins', amount: 1200, icon: 'coin_1' },
        { type: 'coins', amount: 1300, icon: 'coin_1' },
        { type: 'coins', amount: 1400, icon: 'coin_1' },
    ]
};
let game_container;
const standart_ratio = {
    w: 1920,
    h: 1080
};
class Boot extends Phaser.Scene {
    constructor() {
        super('Boot');
    }
    preload() {
        this.load.plugin('rexshakepositionplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexshakepositionplugin.min.js', true);
        this.load.script('loader_bar', 'js/components/loader_bar.js');
        this.load.image('loading_bg', 'assets/preload/loading_bg.png');
        this.load.image('loader_bg', 'assets/preload/loader_bg.png');
        this.load.image('loader_bar', 'assets/preload/loader_bar.png');
        this.load.once('complete', this.create_loader, this);
    }
    create_loader() {
        let bg = this.add.image(0, 0, 'loading_bg');
        bg.setOrigin(0, 0);
        bg.setScale(game_size.width / bg.width, game_size.height / bg.height);
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
        this.load.on('progress', (value) => {
            this.loader.update_progress(value);
        });
        this.load.pack('assets_pack', 'assets_pack.json', 'images');
        this.load.atlas('game_play', 'assets/game_play_atlas.png', 'assets/game_play_atlas.json');
        this.load.atlas('new', 'assets/new_atlas.png', 'assets/new_atlas.json');
        this.load.atlas('skill_anim', 'assets/skill_anim_atlas.png', 'assets/skill_anim_atlas.json');
        this.load.atlas('game_menu', 'assets/game_menu.png', 'assets/game_menu.json');
        this.load.atlas('shop', 'assets/shop.png', 'assets/shop.json');
        this.load.atlas('flags', 'assets/flags.png', 'assets/flags.json');
        this.load.json('map_items', 'assets/data/map_items.json');
        this.load.font('rubik', 'fonts/RubikMarkerHatch-Regular.ttf', 'truetype');
        this.load.scripts('main', [
            'js/game.js',
            'js/scenes/game_menu.js',
            'js/scenes/game_play.js',
            'js/scenes/big_windows.js',
            'js/game_play/game_engine/prepare_frame.js',
            'js/game_play/game_engine/game_field.js',
            'js/game_play/game_engine/bot.js',
            'js/game_play/game_play.js',
            'js/game_play/prepare_field.js',
            'js/game_play/prepare_arsenal.js',
            'js/big_windows/profile.js',
            'js/big_windows/personalization.js',
            'js/big_windows/settings.js',
            'js/big_windows/leaderboard.js',
            'js/big_windows/shop.js',
            'js/big_windows/achivments.js',
            'js/big_windows/tasks.js',
            'js/game_map/game_map.js',
            'js/game_map/map_item.js',
            'js/components/custom_button.js',
            'js/components/custom_text.js',
            'js/components/slider_banner.js',
            'js/managers/language_manager.js',
            'js/managers/windows_manager.js',
            'js/managers/anims_manager.js',
            'js/windows/test_window.js',
            'js/windows/result_battle.js',
            'js/windows/quit_battle.js',
            'js/windows/save_field.js',
            'js/windows/arsenal.js',
            'js/windows/video_oil.js',
            'js/windows/arena_slider.js',
            'js/windows/daily_reward.js',
            'js/windows/options.js',
        ]);
        this.load.start();
    }
    create_game() {
        game_container = new Game(this);
        this.add.existing(game_container);
        game_container.init();
    }
    get_game_size() {
        return { 'W': window.innerWidth, 'H': window.innerHeight };
    }
    set_game_size() {
        var canvas = document.querySelector("canvas");
        var windowWidth;
        var windowHeight;
        if (this && this.scale.isFullscreen) {
            windowWidth = window.innerWidth;
            windowHeight = window.innerHeight;
        }
        else {
            var size = this.get_game_size();
            windowWidth = size['W'];
            windowHeight = size['H'];
        }
        game_size.width = windowWidth;
        game_size.height = windowHeight;
        var windowRatio = windowWidth / windowHeight;
        var gameRatio = standart_ratio.w / standart_ratio.h;
        if (windowRatio < gameRatio) {
            canvas.style.width = windowWidth + "px";
            canvas.style.height = (windowWidth / gameRatio) + "px";
        }
        else {
            canvas.style.height = windowHeight + "px";
            canvas.style.width = (windowHeight * gameRatio) + "px";
        }
    }
}
const config = {
    type: Phaser.AUTO,
    width: standart_ratio.w,
    height: standart_ratio.h,
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
game_size.width = standart_ratio.w;
game_size.height = standart_ratio.h;
