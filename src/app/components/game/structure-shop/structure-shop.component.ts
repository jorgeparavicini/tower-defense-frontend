import { Component, OnInit } from '@angular/core';
import { Position } from 'src/app/models/math.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-structure-shop',
  templateUrl: './structure-shop.component.html',
  styleUrls: ['./structure-shop.component.scss']
})
export class StructureShopComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.gameService.onClick.subscribe((pos: Position) => this.gameService.placeStructure(pos));
  }

}
