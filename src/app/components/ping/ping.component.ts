import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WebSocketConsumer, WebSocketMessage } from 'src/app/services/web-socket.service';

const PING_INTERVAL = 1000;

@Component({
  selector: 'app-ping',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './ping.component.html',
  styleUrls: ['./ping.component.scss']
})
export class PingComponent implements OnInit {

  public ping: number = 0;


  constructor(private ws: WebSocketConsumer, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.ws.messages$.subscribe(
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
    this.ws.sendMessage({ message: "Ping", data: Date.now() } as WebSocketMessage);
  }
}
