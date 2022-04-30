import { ApplicationRef, EventEmitter, Injectable } from '@angular/core';
import { Game } from '../models/game.model';
import { LightningTower } from '../models/lightning-tower.model';
import { GameMap, GameMapInterface } from '../models/map.model';
import { Position } from '../models/math.model';
import { Structure, StructureModel } from '../models/structure.model';
import { StructureService } from './structure.service';
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
  public get game(): Game {
    return this._game!;
  }

  private _structures!: Map<string, StructureModel>;
  public get structures(): Map<string, any> {
    return this._structures;
  }

  constructor(private ws: WebSocketManager, private structureService: StructureService) {
    this.ws.messages$.subscribe((x) => {
      switch (x.message) {
        case 'Map':
          this.updateMap(x.data);
          break;

        case 'Update':
          //console.log(x.data.structures[0]);
          this.updateGame(x.data);
          break;
      }
      this.onUpdate.emit();
    });

    this.structureService.getStructureData().subscribe(x => {
      this._structures = x;
      this.connect();
      console.log("Connecting");
    })
  }

  public connect() {
    this.ws.connect();
  }

  public click(pos: Position) {
    this.placeStructure(pos);
  }

  public placeStructure(pos: Position) {
    this.ws.sendMessage({
      message: 'PlaceStructure',
      data: { structure: 'LightningTower', pos: { x: pos.x, y: pos.y } },
    });
  }

  private updateMap(data: GameMapInterface) {
    this._map = new GameMap(data);
  }

  private updateGame(data: Game) {
    data.structures = data.structures.map(x => this.createStructure(x));
    if (!this._game) {
      this._game = data;
      this.onGameLoaded.emit();
    }
    this._game = data;
  }

  private createStructure(data: Structure): Structure {
    switch (data.model) {
      case "LightningTower":
        return new LightningTower(data, this);
      default:
        throw new Error(`Unknown model ${data.model}`);
    }
  }
}
