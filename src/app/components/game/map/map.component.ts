import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Position } from 'src/app/common/size';
import { GameConsumer } from 'src/app/services/game-manager.service';
import { environment } from 'src/environments/environment';
import { Map, MapInterface } from './map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  resourcesUrl = environment.resourcesUrl;
  map?: Map;
  position: Position = { x: 0, y: 0 };

  constructor(private game: GameConsumer, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.game.messages$.subscribe((x) => {
      // TODO: Add event message identifiers.
      if ('background_image' in x) {
        this.map = new Map(x as MapInterface);
        this.cdr.detectChanges();
      }

      if ('pos' in x) {
        this.position = x.pos;
        this.cdr.detectChanges();
      }
    });
  }
}
