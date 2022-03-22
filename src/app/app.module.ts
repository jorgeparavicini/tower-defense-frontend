import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { PingComponent } from './components/ping/ping.component';
import { GameConsumer, GameManager, GameManagerService } from './services/game-manager.service';
import { MapComponent } from './components/game/map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PingComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    { provide: GameManager, useClass: GameManagerService },
    { provide: GameConsumer, useExisting: GameManager }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
