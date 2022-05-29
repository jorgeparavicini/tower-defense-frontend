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
import { Game } from 'src/app/models/game.model';
import { Position, Size } from 'src/app/models/math.model';
import { environment } from 'src/environments/environment';
import { GameMap } from '../../../models/map.model';
import { StructureShopComponent } from '../structure-shop/structure-shop.component';

interface StructurePlace {
  position: Position,
  structure: String
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'class': 'vw-100 vh-100 position-absolute top-0 start-0 z-background'}
})
export class MapComponent implements OnInit, AfterViewInit {
  resourcesUrl = environment.resourcesUrl;
  onStructurePlace = new EventEmitter<StructurePlace>();

  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild(StructureShopComponent)
  shop!: StructureShopComponent;

  @Input()
  map?: GameMap;

  @Input()
  game?: Game;

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
  ) {
    this.emptyHeart.src = '/assets/icons8-pixel-heart-25.png';
    this.filledHeart.src = '/assets/icons8-pixel-heart-filled-48.png';
  }

  ngOnInit(): void {
    
    //this.gameService.onGameLoaded.subscribe(() => this.mapLoaded());
  }

  ngAfterViewInit(): void {
    this.mapLoaded();
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
    this.ctx.clearRect(
      0,
      0,
      this.map!.size.x,
      this.map!.size.y
    );

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
        this.ctx.drawImage(this.filledHeart, this.size.x - 25 * i, 0, 25, 25);
      } else {
        this.ctx.drawImage(this.emptyHeart, this.size.x - 25 * i, 0, 25, 25);
      }
    }
  }

  private drawEnemies() {

    for (let enemy of this.game!.enemies) {
      this.ctx.beginPath();
      this.ctx.arc(enemy.pos.x, enemy.pos.y, 5, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private drawStructures() {

    for (let structure of this.game!.structures) {

      let spritesheet = structure.getSpritesheet();
      let time_start = this.game!.time - (structure.getAnimationDelay() ?? 0);
      let frameIndex =
        Math.floor(time_start / structure.getAnimationSpeed()) % spritesheet.frames.frames.length;
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

    this.placeStructure({x: x, y: y});
  }

  private placeStructure(pos: Position) {
    let structure = this.shop.selectedStructure;
    if (structure) {
      this.onStructurePlace.emit({position: pos, structure: structure});
    }
  }
}
