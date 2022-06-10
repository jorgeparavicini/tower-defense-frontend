import { Enemy } from "./enemy.model";
import { Structure } from "./structure.model";

export interface Game {
    time: number,
    enemies: Enemy[],
    structures: Structure[],
    current_lives: number,
    is_game_over: boolean,
    coins: number
}
