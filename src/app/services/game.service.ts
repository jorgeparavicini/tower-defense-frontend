import { ApplicationRef, EventEmitter, Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { GameMap, GameMapInterface } from '../models/map.model';
import { Position } from '../models/math.model';
import { WebSocketManager, WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  public onGameLoaded = new EventEmitter<void>();
  public onUpdate = new EventEmitter<void>();
  public onClick = new EventEmitter<Position>();

  private _map?: GameMap;
  public get map(): GameMap | undefined {
    return this._map;
  }

  private _game?: Game;
  public get game(): Game | undefined {
    return this._game;
  }

  private didLoad = false;

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
    this.ws.sendMessage({
      message: 'PlaceStructure',
      data: { structure: 'Grunt', pos: { x: pos.x, y: pos.y } },
    });
  }

  private updateMap(data: GameMapInterface) {
    this._map = new GameMap(data);
  }

  private updateGame(data: Game) {
    this._game = data;
    if (!this.didLoad) {
      this.onGameLoaded.emit();
      this.didLoad = true;
    }
  }
}
