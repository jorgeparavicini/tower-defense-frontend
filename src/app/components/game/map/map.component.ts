import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Position } from 'src/app/common/size';
import { GameService } from 'src/app/services/game.service';
import { environment } from 'src/environments/environment';
import { Map, MapInterface } from '../../../models/map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, AfterViewInit {
  resourcesUrl = environment.resourcesUrl;

  @ViewChild('map', {static: false})
  svgMap!: ElementRef<SVGSVGElement>;

  private point!: DOMPoint;

  constructor(public game: GameService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.game.onUpdate.subscribe(() => this.cdr.detectChanges());
    this.game.onMapLoaded.subscribe(() => this.mapLoaded());
    this.game.connect();
  }

  ngAfterViewInit(): void {
  }

  private mapLoaded() {
    this.cdr.detectChanges();
    this.point = this.svgMap.nativeElement.createSVGPoint();
  }

  public onClick(event: MouseEvent) {
    this.point.x = event.clientX;
    this.point.y = event.clientY;

    let domPos = this.point.matrixTransform(this.svgMap.nativeElement.getScreenCTM()!.inverse());
    let pos = {x: domPos.x, y: domPos.y}
    this.game.click(pos);
  }
}
