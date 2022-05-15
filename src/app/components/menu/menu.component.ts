import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  gameId?: string;

  constructor() { }

  ngOnInit(): void {
  }

  inputChanged(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.gameId = target.value;
  }

  isValidId(): boolean {
    return this.gameId != null && this.gameId.length == 8;
  }
}
