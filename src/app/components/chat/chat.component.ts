import { Component, ElementRef, EventEmitter, OnInit, ViewChild } from '@angular/core';

export interface ChatMessage {
  client: string,
  message: string
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  onMessageSent = new EventEmitter<string>();

  display = false;
  messages: ChatMessage[] = [];

  @ViewChild('input')
  input!: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  toggleChat() {
    this.display = !this.display;
  }

  sendMessage() {
    let value = (this.input.nativeElement as HTMLInputElement).value.trim();
    if (value) {
      this.onMessageSent.emit(value);
    }
    (this.input.nativeElement as HTMLInputElement).value = "";
  }
}
