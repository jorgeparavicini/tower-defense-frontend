import { GifFrame } from "./gif.model";
import { Coord } from "./math.model";

export interface Structure {
    id: number,
    pos: Coord,
    health: number,
    structure_type: string
}

export interface StructureData {
    max_health: number,
    gif_name: string,
    frames: GifFrame[]
}