import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthenticateUserRequest, User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { FooterComponent } from '../footer/footer.component';
import { BackgroundAnimationComponent } from '../background-animation/background-animation.component';
import { NotificationPhrases, NotificationType } from '../../refData/ref-data';
import { TranslationPipe } from 'src/pipes/translation.pipe';

@Component({
  standalone: true,
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    TranslationPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    FooterComponent,
    BackgroundAnimationComponent
  ]
})
export class SignInComponent implements OnInit {
  @ViewChild('signInForm') signInForm!: NgForm;
  @Input() public emailInput: string | undefined;

  public sectionHeader: string = this.translationPipe.transform(NotificationPhrases.SignInHeader);
  public connecting: boolean = false;

  constructor(
    private authenticationService: AuthenticationService, 
    private notificationService: NotificationService, 
    private route: ActivatedRoute, 
    private translationPipe: TranslationPipe
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.userExists()) {
      this.authenticationService.prepareApplication();
      return;
    }

    this.route.queryParams.subscribe(params => {
      const reason: string = params['reason'];

      if (reason !== undefined)
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(reason));
    });
  }

  signIn() {
    this.connecting = true;

    const req : AuthenticateUserRequest = {
      username: this.signInForm.form.value.username_input,
      password: this.signInForm.form.value.password_input
    } 

    this.authenticationService.authenticateUser(req).subscribe({
      next: (response: { user: User, token: string }) => {
        this.connecting = false;
        const connectedUser: User = response.user;
        connectedUser.token = response.token;
        localStorage.removeItem('locked');
        this.authenticationService.updateUser(connectedUser);
        this.authenticationService.prepareApplication(true);
      },
      error: (error: HttpErrorResponse) => {
        this.connecting = false;
        if (error.status === 404) {
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.InvalidUsernameOrPassword));
        }
        else {
          this.notificationService.showError(error);
        }
      }
    });
  }

  forgotPassword() {
    const element: HTMLElement | null = document.querySelector("#signInForm");

    if (element) {
      element.classList.add("hidden-animated")

      element.addEventListener('animationend', () => {
        element.classList.add("disabled-visibility");
        document.querySelector("#passwordResetForm")?.classList.remove("hidden-animated", "disabled-visibility");
        this.sectionHeader = this.translationPipe.transform(NotificationPhrases.ResetYourPassword);
      });
    }
  }

  enableSignInSection() {
    const element: HTMLElement | null = document.querySelector("#passwordResetForm");

    if (element) {
      element.classList.add("hidden-animated")

      element.addEventListener('animationend', () => {
        element.classList.add("disabled-visibility");
        document.querySelector("#signInForm")?.classList.remove("hidden-animated", "disabled-visibility");
        this.sectionHeader = this.translationPipe.transform(NotificationPhrases.SignInHeader);
      });
    }
  }

  requestPasswordReset() {
    if (this.emailInput === undefined || this.emailInput === '') {
      this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.ProvideYourEmailAddress));
      return;
    }

    this.authenticationService.resetPasswordRequest(this.emailInput).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ResetTokenSent));
        this.enableSignInSection();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.InvalidUsernameOrPassword));
        }
        else {
          this.notificationService.showError(error);
        }
      }
    });
  }
}
