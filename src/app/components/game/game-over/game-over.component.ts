import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-game-over',
  templateUrl: './game-over.component.html',
  styleUrls: ['./game-over.component.scss'],
  host: {'class': 'h-100 w-100'}
})
export class GameOverComponent implements OnInit {

  @Input()
  time!: number;

  constructor() { }

  ngOnInit(): void {
  }

}
