import { Component, OnInit } from '@angular/core';
import { Size } from 'src/app/models/math.model';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: '[app-life]',
  templateUrl: './life.component.html',
  styleUrls: ['./life.component.scss']
})
export class LifeComponent implements OnInit {

  public get current_lives(): number {
    return this.gameService.game!.current_lives;
  }

  public get max_lives(): number{
    return this.gameService.map!.max_lives;
  }

  public get size(): Size {
    return this.gameService.map!.size;
  }

  public get is_loaded(): boolean {
    return this.gameService.game != undefined && this.gameService.map != undefined;
  }

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
  }

  public getPositionX(i: number): number {
    return this.size.x - 25 * (i + 1);
  }

  public getPositionY(_: number): number {
    return 0;
  }

}
