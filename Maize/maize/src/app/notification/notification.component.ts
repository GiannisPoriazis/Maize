import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule]
})
export class NotificationComponent implements OnDestroy {
  destroyed: EventEmitter<boolean> = new EventEmitter<boolean>();

  public alertBackgroundColor: string = '';
  public alertMessage: string = '';
  public successIcon: string = '<i class="notification-icon fa-regular fa-circle-check"></i>';
  public infoIcon: string = '<i class="notification-icon fa-regular fa-circle-question"></i>';
  public warningIcon: string = '<i class="notification-icon fa-solid fa-circle-exclamation"></i>';
  public dangerIcon: string = '<i class="notification-icon fa-solid fa-ban"></i>';

  constructor() { }

  ngOnDestroy() {
    this.destroyed.emit();
  }
}
