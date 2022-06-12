import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { EnemyModel } from 'src/app/models/enemy.model';
import { Game } from 'src/app/models/game.model';
import { Position, Size } from 'src/app/models/math.model';
import { Structure, StructureModel } from 'src/app/models/structure.model';
import { EnemyService } from 'src/app/services/enemy.service';
import { StructureService } from 'src/app/services/structure.service';
import { environment } from 'src/environments/environment';
import { GameMap } from '../../../models/map.model';
import { StructureInfoComponent } from '../structure-info/structure-info.component';
import { StructureShopComponent } from '../structure-shop/structure-shop.component';

interface StructurePlace {
  position: Position;
  structure: String;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'vw-100 vh-100 position-absolute top-0 start-0 z-background' },
})
export class MapComponent implements OnInit, AfterViewInit {
  resourcesUrl = environment.resourcesUrl;
  onStructurePlace = new EventEmitter<StructurePlace>();
  onStructureUpgrade = new EventEmitter<Structure>();
  onGameSave = new EventEmitter<void>();

  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild(StructureShopComponent)
  shop!: StructureShopComponent;

  @ViewChild(StructureInfoComponent)
  info!: StructureInfoComponent;

  @Input()
  map?: GameMap;

  @Input()
  game?: Game;

  enemies?: Map<string, EnemyModel>;

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas!.nativeElement.getContext('2d')!;
  }

  private get size(): Size {
    return this.map!.size;
  }

  private emptyHeart = new Image(48, 48);
  private filledHeart = new Image(25, 25);

  constructor(
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    enemyService: EnemyService
  ) {
    this.emptyHeart.src = '/assets/icons8-pixel-heart-25.png';
    this.filledHeart.src = '/assets/icons8-pixel-heart-filled-48.png';

    enemyService.getEnemyModels().subscribe((x) => (this.enemies = x));
  }

  ngOnInit(): void {
    //this.gameService.onGameLoaded.subscribe(() => this.mapLoaded());
  }

  ngAfterViewInit(): void {
    this.mapLoaded();
    this.info.onStructureUpgrade.subscribe((x) =>
      this.onStructureUpgrade.emit(x)
    );
  }

  private mapLoaded() {
    console.log('Loaded');
    this.cdr.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame(() => this.draw());
    });
  }

  private draw() {
    if (!this.game || !this.map || !this.canvas) {
      window.requestAnimationFrame(() => this.draw());
      return;
    }
    this.ctx.clearRect(0, 0, this.map!.size.x, this.map!.size.y);

    this.ctx.imageSmoothingEnabled = false;

    this.drawLifes();
    this.drawEnemies();
    this.drawStructures();

    window.requestAnimationFrame(() => this.draw());
  }

  private drawLifes() {
    let max_lives = this.map!.max_lives;
    let current_lives = this.game!.current_lives;

    for (let i = 0; i < max_lives; i++) {
      if (max_lives - i <= current_lives) {
        this.ctx.drawImage(
          this.filledHeart,
          this.size.x - 25 * (i + 1),
          0,
          25,
          25
        );
      } else {
        this.ctx.drawImage(
          this.emptyHeart,
          this.size.x - 25 * (i + 1),
          0,
          25,
          25
        );
      }
    }
  }

  private drawEnemies() {
    if (!this.enemies) return;
    for (let enemy of this.game!.enemies) {
      let model = this.enemies.get(enemy.enemy_type)!;
      let animationSpeed = enemy.is_dying
        ? model.death_duration / model.dying_frames.frames.frames.length
        : 100;
      let spritesheet = enemy.is_dying ? model.dying_frames : model.idle_frames;
      let time_start = this.game!.time - enemy.animation_start;
      let frameIndex =
        Math.floor(time_start / animationSpeed) %
        spritesheet.frames.frames.length;
      let frame = spritesheet.frames.frames[frameIndex];

      this.ctx.drawImage(spritesheet.image,
        frame.frame.x,
        frame.frame.y,
        frame.frame.w,
        frame.frame.h,
        enemy.pos.x - spritesheet.size.x / 2,
        enemy.pos.y - spritesheet.size.y,
        spritesheet.size.x,
        spritesheet.size.y);
    }
  }

  private drawStructures() {
    for (let structure of this.game!.structures) {
      let spritesheet = structure.getSpritesheet();
      let time_start = this.game!.time - (structure.getAnimationDelay() ?? 0);
      let frameIndex =
        Math.floor(time_start / structure.getAnimationSpeed()) %
        spritesheet.frames.frames.length;
      let frame = spritesheet.frames.frames[frameIndex];
      let image = spritesheet.image;

      this.ctx.drawImage(
        image,
        frame.frame.x,
        frame.frame.y,
        frame.frame.w,
        frame.frame.h,
        structure.pos.x - spritesheet.size.x / 2,
        structure.pos.y - spritesheet.size.y,
        spritesheet.size.x,
        spritesheet.size.y
      );
    }
  }

  public onClick(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    let cw = this.canvas.nativeElement.width;
    let ch = this.canvas.nativeElement.height;
    const x = (event.clientX - rect.left) * (cw / rect.width);
    const y = (event.clientY - rect.top) * (ch / rect.height);

    if (this.shop.selectedStructure) {
      this.placeStructure({ x: x, y: y });
    } else {
      this.selectStructure({ x: x, y: y });
    }
  }

  private placeStructure(pos: Position) {
    let structure = this.shop.selectedStructure;
    if (structure) {
      this.onStructurePlace.emit({ position: pos, structure: structure });
      this.shop.consumeSelectedStructure();
    }
  }

  private selectStructure(pos: Position) {
    for (let structure of this.game!.structures) {
      let dif = { x: pos.x - structure.pos.x, y: pos.y - structure.pos.y };
      let distance = Math.sqrt(Math.pow(dif.x, 2) + Math.pow(dif.y, 2));

      if (distance < structure.radius) {
        this.info.selectStructure(structure);
        return;
      }
    }
    this.info.deselect();
  }

  saveGame() {
    this.onGameSave.emit();
  }
}
