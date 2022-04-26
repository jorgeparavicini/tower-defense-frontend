import { environment } from 'src/environments/environment';
import { GameService } from '../services/game.service';
import { Coord } from './math.model';
import { Spritesheet, SpritesheetFrames } from './spritesheet.model';
import { Structure } from './structure.model';

const IDLE_ANIMATION_SPEED = 50;

export interface LightningTowerModel {
  attack_frames: SpritesheetFrames;
  idle_frames: SpritesheetFrames;
  attack_spritesheet: string;
  idle_spritesheet: string;
  max_health: number;
  attack_range: number;
  attack_damage: number;
  attack_cooldown: number;
  attack_damage_delay: number;
  attack_duration: number;
}

interface Idle {}

interface Attack {
  attack_start: number;
  did_attack: boolean;
}

interface Cooldown {
  attack_end: number;
}

enum State {
  Idle,
  Attack,
  Cooldown,
}

export class LightningTower implements Structure {
  id: number;
  pos: Coord;
  health: number;
  model: string;
  last_attack?: number;
  state: State;
  state_data: Idle | Attack | Cooldown;
  animation_time?: number;

  dataModel: LightningTowerModel;
  attack_spritesheet: Spritesheet;
  idle_spritesheet: Spritesheet;

  constructor(data: any, gameService: GameService) {
    this.id = data.id;
    this.pos = data.pos;
    this.health = data.health;
    this.model = data.model;
    this.last_attack = data.last_attack_time;
    this.state_data = data.state.data;

    switch (data.state.type) {
      case 'Attack':
        this.animation_time = (this.state_data as Attack).attack_start;
        this.state = State.Attack;
        break;

      case 'Cooldown':
        this.state = State.Cooldown;
        break;

      default:
        this.state = State.Idle;
    }

    this.dataModel = gameService.structures.get(
      this.model
    ) as LightningTowerModel;

    // Create Spritesheets
    // TODO: Sizes should come from backend

    this.attack_spritesheet = {
      image: new Image(),
      frames: this.dataModel.attack_frames,
      size: { x: 100, y: 100 },
    };
    this.attack_spritesheet.image.src =
      environment.resourcesUrl + this.dataModel.attack_spritesheet;

    this.idle_spritesheet = {
      image: new Image(),
      frames: this.dataModel.idle_frames,
      size: { x: 50, y: 50 },
    };
    this.idle_spritesheet.image.src =
      environment.resourcesUrl + this.dataModel.idle_spritesheet;
  }

  getSpritesheet(): Spritesheet {
    switch (this.state) {
      case State.Attack:
        return this.attack_spritesheet;

      default:
        return this.idle_spritesheet;
    }
  }

  getAnimationDelay(): number | undefined {
    return this.animation_time;
  }

  getAnimationSpeed(): number {
    if (this.state == State.Attack) {
      return this.dataModel.attack_duration / this.attack_spritesheet.frames.frames.length;
    }
    return IDLE_ANIMATION_SPEED;
  }
}
