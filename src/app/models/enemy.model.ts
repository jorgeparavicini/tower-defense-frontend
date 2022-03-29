import { Coord } from "./math.model";

export interface Enemy {
    enemy_type: String,
    health: number,
    id: number,
    pos: Coord
}