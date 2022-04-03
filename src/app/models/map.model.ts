import { Size } from 'src/app/common/size';

export interface MapInterface {
  background_filler_image: String;
  background_image: String;
  size: Size;
  max_lives: number;
}

export class Map implements MapInterface {
  background_filler_image: String;
  background_image: String;
  size: Size;
  max_lives: number;

  constructor(data: MapInterface) {
    this.background_filler_image = data.background_filler_image;
    this.background_image = data.background_image;
    this.size = data.size;
    this.max_lives = data.max_lives;
  }

  public get viewBox(): String {
    return `0 0 ${this.size.x} ${this.size.y}`;
  }

  public get aspectRatio(): number {
    return this.size.x / this.size.y;
  }

  public get containerStyleClass(): Object {
    return {
      width: '100vw',
      height: `${100 / this.aspectRatio}`,
      'max-width': `${100 * this.aspectRatio}vh`,
      'max-height': '100vh',
    };
  }
}
