import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from 'src/app/services/game.service';

interface Message {
  message: string;
  data: any;
}

import {
  WebSocketConsumer,
  WebSocketManager,
  WebSocketService,
} from 'src/app/services/web-socket.service';
import { environment } from 'src/environments/environment';

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

  constructor(
    private service: WebSocketManager,
    private route: ActivatedRoute
  ) {}

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
        
    }
  }
}
