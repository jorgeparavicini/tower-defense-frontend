import { Coord } from "./math.model";

export interface Structure {
    id: number,
    pos: Coord,
    health: number,
    structure_type: string
}