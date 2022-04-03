import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { PingComponent } from './components/ping/ping.component';
import { WebSocketConsumer, WebSocketManager, WebSocketService } from './services/web-socket.service';
import { MapComponent } from './components/game/map/map.component';
import { EnemyComponent } from './components/game/enemy/enemy.component';
import { LifeComponent } from './components/game/life/life.component';
import { StructureShopComponent } from './components/game/structure-shop/structure-shop.component';
import { StructureComponent } from './components/game/structure/structure.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PingComponent,
    MapComponent,
    EnemyComponent,
    LifeComponent,
    StructureShopComponent,
    StructureComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: WebSocketManager, useClass: WebSocketService },
    { provide: WebSocketConsumer, useExisting: WebSocketManager }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
