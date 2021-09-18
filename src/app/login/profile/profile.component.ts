import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from 'src/app/user/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {
  @Input()
  user: User;

  @Output()
  onLogout: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  logout() {
    this.onLogout.emit({});
  }
}
