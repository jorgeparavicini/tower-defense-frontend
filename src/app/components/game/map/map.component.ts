import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Position } from 'src/app/common/size';
import { GameService } from 'src/app/services/game.service';
import { environment } from 'src/environments/environment';
import { Map, MapInterface } from '../../../models/map.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  resourcesUrl = environment.resourcesUrl;

  constructor(public game: GameService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    /*this.game.messages$.subscribe((x) => {
      // TODO: Add event message identifiers.
      if (x.message === "Map") {
        this.map = new Map(x.data as MapInterface);
        this.cdr.detectChanges();
      }

      if (x.message === "Update") {
        this.position = x.data;
        this.cdr.detectChanges();
      }
    });*/

    this.game.onUpdate.subscribe(() => this.cdr.detectChanges());
  }
}
