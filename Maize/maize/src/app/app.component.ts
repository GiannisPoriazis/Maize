import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { AuthenticationService } from '../services/authentication.service';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterModule]
})
export class AppComponent implements AfterViewInit {
  @ViewChild('notificationContainer', { read: ViewContainerRef }) notificationContainer!: ViewContainerRef;

  constructor(private notificationService: NotificationService, private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.autoLogin();
  }

  ngAfterViewInit() {
    this.notificationService.setContainer(this.notificationContainer);
  }

  title = 'Maize';
}
