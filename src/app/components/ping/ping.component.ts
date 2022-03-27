import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { GameConsumer, GameMessage } from 'src/app/services/game-manager.service';

const PING_INTERVAL = 1000;

interface Ping {
  ping: number;
}

@Component({
  selector: 'app-ping',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.scss']
})
export class PingComponent implements OnInit {

  public ping: number = 0;


  constructor(private game: GameConsumer, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.game.messages$.subscribe(
      x => { 
        if (x.message === "Pong") {
          this.ping = x.data;
          this.cdr.detectChanges();
        }
      }
    )

    setInterval(() => this.sendPing(), PING_INTERVAL);
  }

  public sendPing() {
    this.game.sendMessage({ message: "Ping", data: Date.now() } as GameMessage);
  }
}
