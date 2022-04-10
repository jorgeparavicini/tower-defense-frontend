import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Game } from 'src/app/models/game.model';
import { Size } from 'src/app/models/math.model';
import { StructureData } from 'src/app/models/structure.model';
import { GameService } from 'src/app/services/game.service';
import { StructureService } from 'src/app/services/structure.service';
import { environment } from 'src/environments/environment';
import { GameMap } from '../../../models/map.model';

const ANIMATION_SPEED = 50;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent implements OnInit, AfterViewInit {
  resourcesUrl = environment.resourcesUrl;

  @ViewChild('canvas', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas!.nativeElement.getContext('2d')!;
  }

  private get size(): Size {
    return this.gameService.map!.size;
  }

  private get map(): GameMap {
    return this.gameService.map!;
  }

  private get game(): Game {
    return this.gameService.game!;
  }

  private emptyHeart = new Image(48, 48);
  private filledHeart = new Image(25, 25);
  private structureData?: Map<string, StructureData>;
  private structureImages: Map<string, HTMLImageElement> = new Map();

  constructor(
    public gameService: GameService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    structureService: StructureService
  ) {
    this.emptyHeart.src = '/assets/icons8-pixel-heart-25.png';
    this.filledHeart.src = '/assets/icons8-pixel-heart-filled-48.png';

    structureService
      .getStructureData()
      .subscribe((data) => (this.structureData = data));
  }

  ngOnInit(): void {
    //this.gameService.onUpdate.subscribe(() => this.cdr.detectChanges());
    this.gameService.onGameLoaded.subscribe(() => this.mapLoaded());
    this.gameService.connect();
  }

  ngAfterViewInit(): void {}

  private mapLoaded() {
    console.log('Loaded');
    this.cdr.detectChanges();

    this.ngZone.runOutsideAngular(() => {
      window.requestAnimationFrame(() => this.draw());
    });
  }

  private draw() {
    this.ctx.clearRect(
      0,
      0,
      this.gameService.map!.size.x,
      this.gameService.map!.size.y
    );

    this.ctx.imageSmoothingEnabled = false;

    this.drawLifes();
    this.drawEnemies();
    this.drawStructures();

    window.requestAnimationFrame(() => this.draw());
  }

  private drawLifes() {
    let max_lives = this.gameService.map!.max_lives;
    let current_lives = this.gameService.game!.current_lives;

    for (let i = 0; i < max_lives; i++) {
      if (max_lives - i <= current_lives) {
        this.ctx.drawImage(this.filledHeart, this.size.x - 25 * i, 0, 25, 25);
      } else {
        this.ctx.drawImage(this.emptyHeart, this.size.x - 25 * i, 0, 25, 25);
      }
    }
  }

  private drawEnemies() {
    for (let enemy of this.game.enemies) {
      this.ctx.beginPath();
      this.ctx.arc(enemy.pos.x, enemy.pos.y, 5, 0, 2 * Math.PI);
      this.ctx.fill();
    }
  }

  private drawStructures() {
    if (!this.structureData) return;

    for (let structure of this.game.structures) {
      let structureData = this.structureData!.get(structure.structure_type)!;

      if (!(structure.structure_type in this.structureImages)) {
        let image = new Image();
        image.src = environment.resourcesUrl + structureData.gif_name;
        this.structureImages.set(structure.structure_type, image);
      }

      let frameIndex =
        Math.floor(Date.now() / ANIMATION_SPEED) % structureData.frames.length;
      let frame = structureData.frames[frameIndex];
      let image = this.structureImages.get(structure.structure_type)!;
      this.ctx.drawImage(
        image,
        frame.frame.x,
        frame.frame.y,
        frame.frame.w,
        frame.frame.h,
        structure.pos.x - frame.sourceSize.w / 2,
        structure.pos.y - frame.sourceSize.h,
        frame.sourceSize.w,
        frame.sourceSize.h
      );
    }
  }

  public onClick(event: MouseEvent) {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    let cw = this.canvas.nativeElement.width;
    let ch = this.canvas.nativeElement.height;
    const x = (event.clientX - rect.left) * (cw / rect.width);
    const y = (event.clientY - rect.top) * (ch / rect.height);

    console.log(`x: ${x}, y: ${y}`);

    this.gameService.click({ x: x, y: y });
  }
}
