export enum Seasons{Winter = "Zima", Spring = "Wiosna", Summer = "Lato", Autumn = "Jesień"};
export enum OnGrass{
    Wall = 10,
    Rat = 11,
    Panda = 12,
    Alces = 13,
    Ridder = 14,
    Fireplace = 15,
    Ai = 16,
    Bush = 17
}

export const tileScale = 0.4;
export const tileSize = 128;
export const brainLimit = 100;
export const backgroundMovesPerPreview = 200;

export enum EnemyDamage{
    Rat = 0,
    Panda = 1,
    Alces = 5,
    Ridder = 50
}