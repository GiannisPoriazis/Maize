import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from 'src/interfaces/user.interface';
import { UserRole } from 'src/interfaces/user.role.interface';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { ConfigurationService } from 'src/services/configuration.service';
import { NotificationService } from 'src/services/notification.service';
import { UserService } from 'src/services/user.service';
import { ModalComponent } from '../modal/modal.component';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';

@Component({
  standalone: true,
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [
    TranslationPipe
  ],
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ]
})
export class UserComponent implements OnInit {
  @Input() user?: User;
  @Output() backActionEvent = new EventEmitter();

  public userForm!: FormGroup;
  public userRoles?: UserRole[];
  public pageTitle?: string;
  public showPassword: boolean = false;

  constructor(
    private userService: UserService, 
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe, 
    private configurationService: ConfigurationService,
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  ngOnInit() {
    if(!this.user)
      this.pageTitle = 'new_user_page_title';
    else
      this.pageTitle = 'edit_user_page_title';

    this.userRoles = this.configurationService.userRoles.value;
    this.initForm();
  }

  initForm() {
    if(!this.user) {
      this.userForm = new FormGroup({
        'firstname': new FormControl(null),
        'lastname': new FormControl(null),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'username': new FormControl(null, [Validators.required, Validators.minLength(5), Validators.maxLength(16)]),
        'password': new FormControl(null, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
        'role': new FormControl(this.userRoles![0].id, Validators.required),
        'informUserCredentials': new FormControl(true)
      });

      return;
    }
    
    this.userForm = new FormGroup({
      'firstname': new FormControl(this.user.first_name),
      'lastname': new FormControl(this.user.last_name),
      'email': new FormControl(this.user.email, [Validators.required, Validators.email]),
      'username': new FormControl(this.user.username, [Validators.required, Validators.minLength(5), Validators.maxLength(16)]),
      'password': new FormControl(this.user.password, [Validators.required, Validators.minLength(8), Validators.maxLength(16)]),
      'role': new FormControl(this.user.role, Validators.required)
    });
  }

  togglePasswordVisibility() {
    const value = this.userForm.controls['password'].value;
    this.showPassword = !this.showPassword;
    this.userForm.controls['password'].setValue(value);
  }

  onSubmit() {
    const user: User = {
      id: !this.user ? 0 : this.user.id,
      username: this.userForm.value.username,
      password: this.userForm.value.password,
      email: this.userForm.value.email,
      first_name: this.userForm.value.firstname,
      last_name: this.userForm.value.lastname,
      role: this.userForm.value.role,
      token: ''
    }

    if(!this.user) {
      this.createUser(user);
      return;
    }

    this.updateUser(user);
  }

  createUser(user: User) {
    this.userService.createUser(user, this.userForm.value.informUserCredentials).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.UserCreated), this.notificationSoundPipe.transform());
        this.userForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  updateUser(user: User) {
    this.userService.updateUser(user).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.UserUpdated), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  deleteUser() {
    const userId: number = this.user!.id;

    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.UserDeleted), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  backAction() {
    this.backActionEvent.emit();
    this.user = undefined;
  }
}
