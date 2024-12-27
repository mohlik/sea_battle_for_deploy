declare interface LoaderBarConfig {
    atlas?: string,
    frame_bg: string,
    frame_bar: string
}

declare interface MapItemConfig {
    type: string,
    atlas?: string,
    broke_frame: string,
    live_frame: string,
    scale?: number,
    pos: {
        x: number,
        y: number,
    }
}

declare interface CustomButtonConfig {
    x: number,
    y: number,
    atlas?: string,
    frame_out: string,
    frame_over?: string,
    frame_down?: string,
    callback: Function
}

declare type FantomsArray = [
    Phaser.GameObjects.Image,
    Phaser.GameObjects.Image,
    Phaser.GameObjects.Image,
    Phaser.GameObjects.Image
]

declare type Field = [
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
    [number, number, number, number, number, number, number, number, number, number],
]