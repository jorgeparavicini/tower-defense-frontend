import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { catchError, tap, switchAll, retryWhen, delayWhen } from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable, timer } from 'rxjs';
import { environment } from 'src/environments/environment';

export const WS_ENDPOINT = environment.wsEndpoint;
export const RECONNECT_INTERVAL = environment.reconnectInterval;

interface ConnectCFG {
  reconnect: boolean;
}

export abstract class GameConsumer {
  abstract messages$: Observable<GameMessage>;

  abstract sendMessage(msg: GameMessage): void;
}

export abstract class GameManager extends GameConsumer {
  abstract connect(cfg?: ConnectCFG): void;
  abstract close(): void;
}

export interface GameMessage {
  message: string,
  data: any
}

@Injectable()
export class GameManagerService implements GameManager {
  private socket$?: WebSocketSubject<GameMessage>;
  private messagesSubject$ = new BehaviorSubject<Observable<GameMessage>>(EMPTY);
  public messages$: Observable<GameMessage> = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e }));

  constructor() { }

  public connect(cfg: ConnectCFG = { reconnect: false }): void {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = this.getNewWebSocket() as WebSocketSubject<GameMessage>;
      const messages = this.socket$.pipe(cfg.reconnect ? this.reconnect : o => o,
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));

      this.messagesSubject$.next(messages);
    }
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(retryWhen(errors => errors.pipe(tap(val => console.log("Trying to reconnect.", val)),
      delayWhen(_ => timer(RECONNECT_INTERVAL))
    )));
  }

  private getNewWebSocket() {
    return webSocket({
      url: WS_ENDPOINT,
      openObserver: {
        next: () => {
          console.log('Connected');
        }
      },
      closeObserver: {
        next: () => {
          console.log('connection closed');
          this.socket$ = undefined;
          this.connect({ reconnect: true });
        }
      }
    });
  }

  public sendMessage(msg: GameMessage): void {
    this.socket$?.next(msg);
  }

  public close(): void {
    this.socket$?.complete();
    this.socket$ = undefined;
  }
}
