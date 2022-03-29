import { Enemy } from "./enemy.model";

export interface Game {
    time: number,
    enemies: Enemy[]
}