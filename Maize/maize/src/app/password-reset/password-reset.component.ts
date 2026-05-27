import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BackgroundAnimationComponent } from '../background-animation/background-animation.component';
import { FooterComponent } from '../footer/footer.component';
import { NotificationType } from '../../refData/ref-data';

@Component({
  standalone: true,
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss', '../sign-in/sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    BackgroundAnimationComponent,
    FooterComponent
  ]
})
export class PasswordResetComponent implements OnInit {
  public sectionHeader: string = 'Set a new password for your account';
  private token: string | null = null;

  @Input() public passwordInput: string | undefined;
  @Input() public confirmPasswordInput: string | undefined;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];

    if (this.token === null) {
      this.notificationService.renderTemplate(NotificationType.Error, 'Invalid or expired token');
      return;
    }
  }

  goToSignIn() {
    this.router.navigate(['']);
  }

  async resetPassword() {
    if (this.confirmPasswordInput === undefined || this.confirmPasswordInput === '' || this.passwordInput === undefined || this.passwordInput === '') {
      this.notificationService.renderTemplate(NotificationType.Warning, 'Fields cannot be empty');
      return;
    }

    if (this.confirmPasswordInput != this.passwordInput) {
      this.notificationService.renderTemplate(NotificationType.Warning, 'Password do not match');
      return;
    }

    if (this.token === null) {
      this.notificationService.renderTemplate(NotificationType.Error, 'Invalid or expired token');
      return;
    }

    this.authenticationService.resetPassword(this.token, this.passwordInput).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, 'Your password has been changed');
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.notificationService.renderTemplate(NotificationType.Error, 'Invalid or expired token');
        }
        else {
          this.notificationService.showError(error);
        }
      }
    });
  }
}
