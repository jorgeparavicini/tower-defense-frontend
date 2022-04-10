import { Size } from 'src/app/common/size';

export interface GameMapInterface {
  background_filler_image: String;
  background_image: String;
  size: Size;
  max_lives: number;
}

export class GameMap implements GameMapInterface {
  background_filler_image: String;
  background_image: String;
  size: Size;
  max_lives: number;

  constructor(data: GameMapInterface) {
    this.background_filler_image = data.background_filler_image;
    this.background_image = data.background_image;
    this.size = data.size;
    this.max_lives = data.max_lives;
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
