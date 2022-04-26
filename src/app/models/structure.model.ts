import { Coord } from "./math.model";
import { Spritesheet, SpritesheetFrame } from "./spritesheet.model";

export interface Structure {
    id: number,
    pos: Coord,
    health: number,
    model: string,

    getSpritesheet(): Spritesheet;
    getAnimationDelay(): number | undefined;
    getAnimationSpeed(): number;
}

export interface StructureModel {
    max_health: number,
}