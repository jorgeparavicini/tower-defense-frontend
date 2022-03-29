import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: '[app-enemy]',
  templateUrl: './enemy.component.html',
  styleUrls: ['./enemy.component.scss']
})
export class EnemyComponent implements OnInit {

  constructor(public gameService: GameService) { }

  ngOnInit(): void {
  }

}
