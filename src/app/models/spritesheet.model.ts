import { Frame, Size, SourceSize } from './math.model';

export interface SpritesheetFrame {
  frame: Frame;
  rotated: boolean;
  trimmed: boolean;
  spriteSourceSize: Frame;
  sourceSize: SourceSize;
}

export interface SpritesheetFrames {
  frames: SpritesheetFrame[];
}

export interface Spritesheet {
  image: HTMLImageElement;
  frames: SpritesheetFrames;
  size: Size;
}
