import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import {
  catchError,
  tap,
  switchAll,
  retryWhen,
  delayWhen,
} from 'rxjs/operators';
import { BehaviorSubject, EMPTY, Observable, timer, of } from 'rxjs';
import { environment } from 'src/environments/environment';

export const RECONNECT_INTERVAL = environment.reconnectInterval;

interface ConnectCFG {
  reconnect: boolean;
}

export abstract class WebSocketConsumer {
  abstract messages$: Observable<WebSocketMessage>;

  abstract sendMessage(msg: WebSocketMessage): void;
}

export abstract class WebSocketManager extends WebSocketConsumer {
  abstract connect(url: string, cfg?: ConnectCFG): void;
  abstract close(): void;
}

export interface WebSocketMessage {
  message: string;
  data: any;
}

@Injectable()
export class WebSocketService implements WebSocketManager {
  private socket$?: WebSocketSubject<WebSocketMessage>;
  private messagesSubject$ = new BehaviorSubject<Observable<WebSocketMessage>>(
    EMPTY
  );
  public messages$: Observable<WebSocketMessage> = this.messagesSubject$.pipe(
    switchAll(),
    catchError((e) => {
      throw e;
    })
  );

  constructor() {
    console.log('Creating new websocket service');
  }

  public connect(url: string, cfg: ConnectCFG = { reconnect: false }): void {
    if (!this.socket$ || this.socket$.closed) {
      console.log('Establishing connection to ' + url);

      this.socket$ = this.getNewWebSocket(
        url
      ) as WebSocketSubject<WebSocketMessage>;

      const messages = this.socket$.pipe(
        cfg.reconnect ? this.reconnect : (o) => o,
        tap({
          error: (error) => {
            if (error.type == 'error') {
              const m = of({message: "Not Found", data: "Lobby not found"} as WebSocketMessage);
              this.messagesSubject$.next(m);
            }
            console.log(error)
          },
        }),
        catchError((_) => EMPTY)
      );

      this.messagesSubject$.next(messages);
    }
  }

  private reconnect(observable: Observable<any>): Observable<any> {
    return observable.pipe(
      retryWhen((errors) =>
        errors.pipe(
          tap((val) => console.log('Trying to reconnect.', val)),
          delayWhen((_) => timer(RECONNECT_INTERVAL))
        )
      )
    );
  }

  private getNewWebSocket(url: string) {
    return webSocket({
      url: url,
      openObserver: {
        next: () => {
          console.log('Connected');
        },
      },
      closeObserver: {
        next: () => {
          console.log('Connection closed');
          this.socket$ = undefined;
          if 
          //this.connect(url, { reconnect: true });
        },
      },
    });
  }

  public sendMessage(msg: WebSocketMessage): void {
    this.socket$?.next(msg);
  }

  public close(): void {
    this.socket$?.complete();
    this.socket$ = undefined;
  }
}
