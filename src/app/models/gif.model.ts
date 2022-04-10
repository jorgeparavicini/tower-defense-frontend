import { Frame, Size, SourceSize } from "./math.model";

export interface GifFrame {
    frame: Frame,
    rotated: boolean,
    trimmed: boolean,
    spriteSourceSize: Frame,
    sourceSize: SourceSize
}