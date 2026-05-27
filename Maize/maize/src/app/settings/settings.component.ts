import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SettingsContract } from 'src/interfaces/settings.contract.interface';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { ConfigurationService } from 'src/services/configuration.service';
import { CompanyTypes, FontSizes, GridThemes, Languages, LockScreenTimeouts, NotificationPhrases, NotificationType, SignalRAction, Themes, Timezones } from 'src/refData/ref-data';
import { AuthenticationService } from 'src/services/authentication.service';
import { AppSettings } from 'src/interfaces/app.settings.interface';
import { AdminSettings } from 'src/interfaces/admin.settings.interface';
import { SignalRService } from 'src/services/signalR.service';
import { NotificationService } from 'src/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ListGroupItemThemeDirective } from 'src/directives/list-group-item.theme.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';

@Component({
  selector: 'app-settings',
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
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  public isAdmin: boolean = false;
  public showSecurityPin: boolean = false;
  public theme?: number;
  public activeTab: number = 0;
  public languages = Object.values(Languages);
  public timezones = Timezones;
  public themes = Themes;
  public fontSizes = FontSizes;
  public gridThemes = GridThemes;
  public companyTypes = CompanyTypes;
  public lockScreenTimeouts = LockScreenTimeouts;

  public localizationForm!: FormGroup;
  public customizationForm!: FormGroup;
  public orientationForm!: FormGroup;
  public notificationsForm!: FormGroup;
  public securityForm!: FormGroup;

  private settings?: SettingsContract;

  constructor(
    private configurationService: ConfigurationService, 
    private authenticationService: AuthenticationService, 
    private signalRService: SignalRService, 
    private notificationService: NotificationService,
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  ngOnInit(): void {
    if (this.authenticationService.authorizePermission("ADMIN_SETTINGS")) {
      this.isAdmin = true;
    }

    this.settings = {
      adminSettings: undefined,
      appSettings: undefined
    }

    this.configurationService.adminSettings.subscribe((adminSettings) => {
      this.settings!.adminSettings = adminSettings!;
    });
    this.configurationService.appSettings.subscribe((appSettings) => {
      this.settings!.appSettings = appSettings!;
      this.theme = appSettings?.theme;
    });

    this.initForm();
  }

  initForm() {
    this.localizationForm = new FormGroup({
      'language': new FormControl(this.settings?.appSettings?.language),
      'timezone': new FormControl(this.settings?.appSettings?.timezone)
    });

    this.customizationForm = new FormGroup({
      'theme': new FormControl(this.settings?.appSettings?.theme),
      'fontsize': new FormControl(this.settings?.appSettings?.fontsize),
      'grid_theme': new FormControl(this.settings?.appSettings?.grid_theme)
    });

    this.orientationForm = new FormGroup({
      'company_type': new FormControl(this.settings?.adminSettings?.company_type, [Validators.required]),
    });

    this.notificationsForm = new FormGroup({
      'notification_sound': new FormControl(this.settings?.appSettings?.notification_sound),
      'notification_alerts': new FormControl(this.settings?.appSettings?.notification_alerts)
    });

    this.securityForm = new FormGroup({
      'lock_screen': new FormControl(this.settings?.appSettings?.lock_screen, [Validators.required]),
      'lock_screen_timeout': new FormControl(this.settings?.appSettings?.lock_screen_timeout),
      'pin': new FormControl(this.settings?.appSettings?.pin, [Validators.minLength(4), Validators.maxLength(6)])
    });
  }

  switchTab(tab: number) {
    this.activeTab = tab;
    this.initForm();
  }

  togglePinVisibility() {
    this.showSecurityPin = !this.showSecurityPin;
  }

  onSubmit() {
    const newAppSettings: AppSettings = {
      userId: this.authenticationService.getCurrentUser().value!.id,
      language: this.localizationForm.value.language,
      fontsize: this.customizationForm.value.fontsize,
      timezone: this.localizationForm.value.timezone,
      theme: this.customizationForm.value.theme,
      grid_theme: this.customizationForm.value.grid_theme,
      notification_sound: (this.notificationsForm.value.notification_sound) ? 1 : 0,
      notification_alerts: (this.notificationsForm.value.notification_alerts) ? 1 : 0,
      pin: this.securityForm.value.pin,
      lock_screen: (this.securityForm.value.lock_screen) ? 1 : 0,
      lock_screen_timeout: this.securityForm.value.lock_screen_timeout
    }

    if (this.isAdmin && this.orientationForm.dirty) {
      const newAdminSettings: AdminSettings = {
        company_type: this.orientationForm.value.company_type
      }

      this.configurationService.updateSettings(newAppSettings, newAdminSettings).subscribe({
        next: () => {
          this.signalRService.sendAction(SignalRAction.AdminSettingsUpdated, newAppSettings.userId);
          return;
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      });
    }
    else {
      this.configurationService.updateSettings(newAppSettings, null).subscribe({
        next: () => {
          this.authenticationService.prepareApplication(false, false);
          this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.SettingsUpdated), this.notificationSoundPipe.transform());
          return;
        },
        error: (error: HttpErrorResponse) => {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      });
    }
  }
}
