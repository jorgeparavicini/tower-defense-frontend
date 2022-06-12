import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Enemy } from 'src/app/models/enemy.model';
import { Game } from 'src/app/models/game.model';
import { LightningTowerV1 } from 'src/app/models/lightning-tower-v1.model';
import { LightningTower } from 'src/app/models/lightning-tower.model';
import { GameMap } from 'src/app/models/map.model';
import { Structure, StructureModel } from 'src/app/models/structure.model';
import { StructureService } from 'src/app/services/structure.service';
import { ToastService } from 'src/app/services/toast.service';

interface Message {
  message: string;
  data: any;
}

import {
  WebSocketConsumer,
  WebSocketManager,
  WebSocketMessage,
  WebSocketService,
} from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';
import { MapComponent } from '../game/map/map.component';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss'],
  providers: [
    { provide: WebSocketManager, useClass: WebSocketService },
    { provide: WebSocketConsumer, useExisting: WebSocketManager },
  ],
})
export class LobbyComponent implements OnInit, OnDestroy {
  isHost: boolean = true;
  players: string[] = [];
  lobby!: string;

  gameMap?: GameMap;
  game?: Game;
  structures!: Map<string, StructureModel>;

  private gameInstance?: MapComponent;
  @ViewChild('gameInstance', { static: false }) set content(
    content: MapComponent
  ) {
    if (content) {
      console.log('Initializing game');
      this.gameInstance = content;
      this.gameInstance.onStructurePlace.subscribe((x) =>
        this.service.sendMessage({
          message: 'PlaceStructure',
          data: { structure: x.structure, pos: x.position },
        })
      );
      this.gameInstance.onStructureUpgrade.subscribe((x) => {
        console.log("Upgrading");
        this.service.sendMessage({
          message: 'UpgradeStructure',
          data: { id: x.id },
        });
      });
    }
  }

  constructor(
    private service: WebSocketManager,
    private route: ActivatedRoute,
    private chr: ChangeDetectorRef,
    private toastService: ToastService,
    private router: Router,
    private structureService: StructureService
  ) {
    this.structureService.getStructureData().subscribe((x) => {
      this.structures = x;
    });
  }

  ngOnInit(): void {
    this.service.messages$.subscribe((x) => this.handleMessage(x as Message));
    let gameId = this.route.snapshot.queryParamMap.get('id');

    if (gameId) {
      this.isHost = false;
      this.lobby = gameId;
    }

    console.log('Connecting to lobby: ' + gameId);
    let path = gameId ? `join/${gameId}` : 'create';
    this.service.connect(`${environment.wsEndpoint}${path}`);
  }

  ngOnDestroy(): void {
    console.log('Closing connection');
    this.service.close();
  }

  handleMessage(message: Message) {
    switch (message.message) {
      case 'Players':
        this.players = message.data;
        break;

      case 'Lobby':
        this.lobby = message.data;
        break;

      case 'Not Found':
        console.log('Lobby not found');
        this.toastService.show('Could not find lobby', {
          classname: 'bg-danger text-light',
        });
        this.router.navigateByUrl('/menu');
        break;

      case 'GameClosed':
        console.log('Game closed');
        this.toastService.show('Game was closed by the host', {
          classname: 'bg-primary text-light',
        });
        this.router.navigateByUrl('/menu');
        break;

      case 'ClientUpdate':
        let data = message.data[0] as WebSocketMessage;
        if (data.message == 'Map') {
          this.gameMap = new GameMap(JSON.parse(data.data));
        } else {
          let d = JSON.parse(data.data) as Game;
          d.structures = d.structures.map((x) => this.createStructure(x));
          d.coins = message.data[1];
          d.enemies = d.enemies.map(x => new Enemy(x));
          this.game = d;
          this.chr.detectChanges();
        }
        break;
    }
  }

  startGame(): void {
    this.service.sendMessage({ message: 'Start', data: null });
  }

  private createStructure(data: Structure): Structure {
    switch (data.model) {
      case 'LightningTower':
        return new LightningTower(data, this.structures);

      case 'LightningTowerV1':
        return new LightningTowerV1(data, this.structures);
      default:
        throw new Error(`Unknown model ${data.model}`);
    }
  }
}
