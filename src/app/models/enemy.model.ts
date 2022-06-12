import { environment } from 'src/environments/environment';
import { Coord } from './math.model';
import { Spritesheet } from './spritesheet.model';


export class Enemy {
  id: number;
  pos: Coord;
  health: number;
  enemy_type: string;
  animation_start: number;
  is_dying: boolean;

  constructor(data: any) {
    this.id = data['id'];
    this.pos = data['pos'];
    this.health = data['health'];
    this.enemy_type = data['enemy_type'];
    this.is_dying = data['state']['type'] == 'Dying';

    if (this.is_dying) {
      this.animation_start = data['state']['data']['time_of_death'];
    } else {
      this.animation_start = 0;
    }
  }
}

export class EnemyModel {
  max_health: number;
  damage: number;
  move_speed: number;
  coin_reward: number;
  idle_frames: Spritesheet;
  dying_frames: Spritesheet;
  death_duration: number;

  constructor(data: any) {
    this.max_health = data['max_health'];
    this.damage = data['damage'];
    this.move_speed = data['move_speed'];
    this.coin_reward = data['coin_reward'];
    this.death_duration = data['death_duration'];

    this.idle_frames = {
      image: new Image(),
      frames: data['idle_frames'],
      size: { x: 40, y: 40 },
    };
    this.idle_frames.image.src =
      environment.resourcesUrl + data['idle_spritesheet'];

    this.dying_frames = {
      image: new Image(),
      frames: data['dying_frames'],
      size: { x: 40, y: 40 },
    };
    this.dying_frames.image.src =
      environment.resourcesUrl + data['dying_spritesheet'];
  }
}
