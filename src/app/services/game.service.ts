import { ApplicationRef, EventEmitter, Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { Map, MapInterface } from '../models/map.model';
import { Position } from '../models/math.model';
import { WebSocketManager, WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public onMapLoaded = new EventEmitter<void>();
  public onUpdate = new EventEmitter<void>();
  public onClick = new EventEmitter<Position>();

  private _map?: Map;
  public get map(): Map | undefined {
    return this._map;
  }

  private _game?: Game;
  public get game(): Game | undefined {
    return this._game;
  }

  constructor(private ws: WebSocketManager) {
    this.ws.messages$.subscribe((x) => {
      switch (x.message) {
        case 'Map':
          this.updateMap(x.data);
          break;

        case 'Update':
          this.updateGame(x.data);
          break;
      }
      this.onUpdate.emit();
    });
  }

  public connect() {
    this.ws.connect();
  }

  public click(pos: Position) {
    this.onClick.emit(pos);
  }

  public placeStructure(pos: Position) {
    this.ws.sendMessage({message: "PlaceStructure", data: {structure: "Grunt", pos: {x: pos.x, y: pos.y}}})
  }

  private updateMap(data: MapInterface) {
    this._map = new Map(data);
    this.onMapLoaded.emit();
  }

  private updateGame(data: Game) {
    this._game = data;
  }
}
