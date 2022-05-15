import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent } from './components/lobby/lobby.component';
import { MenuComponent } from './components/menu/menu.component';

const routes: Routes = [
  { path: 'lobby', component: LobbyComponent },
  { path: 'menu', component: MenuComponent },
  { path: '**', redirectTo: 'menu' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
