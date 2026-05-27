import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ListGroupItemThemeDirective } from 'src/directives/list-group-item.theme.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { User } from 'src/interfaces/user.interface';
import { UserRole } from 'src/interfaces/user.role.interface';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { AuthenticationService } from 'src/services/authentication.service';
import { ConfigurationService } from 'src/services/configuration.service';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/services/user.service';

@Component({
  selector: 'profile',
  standalone: true,
  providers: [
    TranslationPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslationPipe,
    ThemeDirective,
    BackgroundThemeDirective,
    ListGroupItemThemeDirective
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  public activeTab: number = 0;
  public showPassword: boolean = false;
  public userRoles?: UserRole[];

  public userDetailsForm!: FormGroup;
  public contactDetailsForm!: FormGroup;
  public accountCredentialsForm!: FormGroup;
  public userRolesForm!: FormGroup;
  
  private profile?: User;

  constructor(
    private configurationService: ConfigurationService, 
    private authenticationService: AuthenticationService, 
    private userService: UserService,
    private notificationService: NotificationService,
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  ngOnInit() {
    this.profile = Object.assign({}, this.authenticationService.getCurrentUser().value);
    this.userRoles = this.configurationService.userRoles.value;
    this.initForm();
  }

  initForm() {
    this.userDetailsForm = new FormGroup({
      'firstname': new FormControl(this.profile?.first_name),
      'lastname': new FormControl(this.profile?.last_name)
    });

    this.contactDetailsForm = new FormGroup({
      'email': new FormControl(this.profile?.email, [Validators.required, Validators.email])
    });

    this.accountCredentialsForm = new FormGroup({
      'username': new FormControl(this.profile?.username, [Validators.required, Validators.minLength(5), Validators.maxLength(16)]),
      'password': new FormControl(this.profile?.password, [Validators.required, Validators.minLength(8), Validators.maxLength(16)])
    });

    this.userRolesForm = new FormGroup({
      'role': new FormControl(this.profile?.role, Validators.required)
    });

    if(this.profile?.role === 1)
      this.userRolesForm.controls['role'].disable();
  }

  switchTab(tab: number) {
    this.activeTab = tab;
    this.initForm();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.profile!.first_name = this.userDetailsForm.value.firstname;
    this.profile!.last_name = this.userDetailsForm.value.lastname;
    this.profile!.email = this.contactDetailsForm.value.email;
    this.profile!.username = this.accountCredentialsForm.value.username;
    this.profile!.password = this.accountCredentialsForm.value.password;
    this.profile!.role = this.userRolesForm.value.role;

    this.userService.updateUser(this.profile!).subscribe({
      next: () => {
        this.authenticationService.updateUser(this.profile);
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ProfileUpdated), this.notificationSoundPipe.transform());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    })
  }
}
