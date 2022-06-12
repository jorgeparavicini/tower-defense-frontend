import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { PingComponent } from './components/ping/ping.component';
import { WebSocketConsumer, WebSocketManager, WebSocketService } from './services/web-socket.service';
import { MapComponent } from './components/game/map/map.component';
import { StructureShopComponent } from './components/game/structure-shop/structure-shop.component';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './components/menu/menu.component';
import { LobbyComponent } from './components/lobby/lobby.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastsComponent } from './components/toasts/toasts.component';
import { StructureInfoComponent } from './components/game/structure-info/structure-info.component';
import { GameOverComponent } from './components/game/game-over/game-over.component';
import { ChatComponent } from './components/chat/chat.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PingComponent,
    MapComponent,
    StructureShopComponent,
    MenuComponent,
    LobbyComponent,
    ToastsComponent,
    StructureInfoComponent,
    GameOverComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
