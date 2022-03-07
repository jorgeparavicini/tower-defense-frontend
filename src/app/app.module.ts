import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { PingComponent } from './components/ping/ping.component';
import { GameConsumer, GameManager, GameManagerService } from './services/game-manager.service';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    PingComponent
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
