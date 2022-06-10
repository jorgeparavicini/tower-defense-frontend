import { Coord } from "./math.model";
import { Spritesheet, SpritesheetFrame } from "./spritesheet.model";

export interface Structure {
    id: number,
    pos: Coord,
    health: number,
    model: string,
    radius: number

    getSpritesheet(): Spritesheet;
    getAnimationDelay(): number | undefined;
    getAnimationSpeed(): number;
}

export interface StructureModel {
    max_health: number,
    icon: string,
    can_be_bought: boolean,
    can_be_upgraded: boolean,
    attack_range: number,
    radius: number,
    attack_damage: number,
    attack_cooldown: number,
    attack_damage_delay: number,
    attack_duration: number
    name: string
    level: number
}
