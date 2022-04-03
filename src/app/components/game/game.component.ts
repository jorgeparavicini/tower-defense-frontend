import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

interface Position {
  pos: number;
}

@Component({
  selector: 'app-game',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private service: GameService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    //this.service.messages$.subscribe(x => console.log(x));
  }
}
