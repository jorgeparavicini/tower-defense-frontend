import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { GameManager, GameManagerService } from 'src/app/services/game-manager.service';

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

  constructor(private service: GameManager) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.service.messages$.subscribe(x => console.log(x));
    this.service.connect();
  }
}
