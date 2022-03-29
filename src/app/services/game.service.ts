import { ApplicationRef, EventEmitter, Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { Map, MapInterface } from '../models/map.model';
import { WebSocketManager, WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public onUpdate = new EventEmitter<void>();

  private _map?: Map;
  public get map(): Map | undefined {
    return this._map;
  }

  private _game?: Game;
  public get game(): Game | undefined {
    return this._game;
  }

  constructor(private ws: WebSocketManager) {
    this.ws.connect();
    this.ws.messages$.subscribe((x) => {
      switch (x.message) {
        case 'Map':
          this.updateMap(x.data);
          break;

        case 'Update':
          this.updateGame(x.data);
          break;
      }
      console.log(x);
      this.onUpdate.emit();
    });
  }

  private updateMap(data: MapInterface) {
    this._map = new Map(data);
  }

  private updateGame(data: Game) {
    this._game = data;
  }
}
