import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { VerticalStepProgressBarComponent } from '../vertical-step-progress-bar/vertical-step-progress-bar.component';
import { SetupView } from '../../interfaces/setup.view.interface';
import { AppSettings } from '../../interfaces/app.settings.interface';
import { ConfigurationService } from '../../services/configuration.service';
import { AuthenticationService } from '../../services/authentication.service';
import { StarBackgroundAnimationComponent } from '../star-background-animation/star-background-animation.component';
import { AdminSettings } from '../../interfaces/admin.settings.interface';
import { TranslationPipe } from '../../pipes/translation.pipe';
import { SignalRService } from 'src/services/signalR.service';
import { CompanyTypes, FontSizes, GridThemes, Languages, LockScreenTimeouts, SignalRAction, Themes, Timezones } from 'src/refData/ref-data';
import { MinionEyeToggleComponent } from '../minion-eye-toggle/minion-eye-toggle.component';

@Component({
  standalone: true,
  selector: 'app-setup-wizard',
  templateUrl: './setup-wizard.component.html',
  styleUrls: ['./setup-wizard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    FormsModule,
    VerticalStepProgressBarComponent,
    StarBackgroundAnimationComponent,
    TranslationPipe,
    MinionEyeToggleComponent
  ]
})

export class SetupWizardComponent implements OnInit {
  @ViewChild('progressBar', { read: VerticalStepProgressBarComponent }) progressBar: VerticalStepProgressBarComponent | undefined;


  public languages = Object.values(Languages);
  public timezones = Timezones;
  public themes = Themes;
  public fontSizes = FontSizes;
  public gridThemes = GridThemes;
  public companyTypes = CompanyTypes;
  public lockScreenTimeouts = LockScreenTimeouts;

  public proceedText: string = 'Start';
  public steps: string[] | undefined;
  public currentStep: number = 0;
  public views: SetupView[] = [];
  public viewsArray: SetupView[] = [
    {
      title: 'setup_step_introduction',
      selectorId: 'introductionView',
      adminOnly: false
    },
    {
      title: 'setup_step_localization',
      selectorId: 'localizationView',
      adminOnly: false,
      timezone: this.timezones[0].value,
      language: this.languages[0]
    },
    {
      title: 'setup_step_orientation',
      selectorId: 'orientationView',
      adminOnly: true,
      businessType: this.companyTypes[0].value
    },
    {
      title: 'setup_step_customization',
      selectorId: 'customizationView',
      adminOnly: false,
      theme: this.themes[0].value,
      fontSize: this.fontSizes[0].value
    },
    {
      title: 'setup_step_notifications',
      selectorId: 'notificationsView',
      adminOnly: false,
      notification_sound: 1,
      notification_alerts: 1
    },
    {
      title: 'setup_step_security',
      selectorId: 'securityView',
      adminOnly: false,
      lock_screen: 1,
      lock_screen_timeout: this.lockScreenTimeouts[0].value,
      pin: '1234'
    }
  ];

  private toggleValues = [
    {
      selector: 'lock_screen',
      value: this.viewsArray.find(view => view['lock_screen'] !== undefined)!['lock_screen']
    },
    {
      selector: 'notification_sound',
      value: this.viewsArray.find(view => view['notification_sound'] !== undefined)!['notification_sound']
    },
    {
      selector: 'notification_alerts',
      value: this.viewsArray.find(view => view['notification_alerts'] !== undefined)!['notification_alerts']
    },
  ]

  constructor(
    private authenticationService: AuthenticationService, 
    private configurationService: ConfigurationService, 
    private signalRService: SignalRService,
  ) { }

  ngOnInit(): void {
    if (this.authenticationService.authorizePermission("ADMIN_SETTINGS")) {
      this.views = this.viewsArray.slice();
      this.steps = this.views.map(view => view.title);
      return;
    }

    this.views = this.viewsArray.filter(view => view.adminOnly == false).slice();
    this.steps = this.views.filter(view => view.adminOnly == false).map(view => view.title);
  }

  transitionViews(view: HTMLElement, enableNext: boolean = true): void {
    if (!enableNext) {
      view.parentElement?.classList.add('hidden-animated');
      return;
    }

    if (!!view) {
      view.classList.add('hidden-animated');

      view.addEventListener('animationend', () => {
        view.classList.add('disabled-visibility');

        const nextView = document.querySelector(`#${this.views[this.currentStep].selectorId}`) as HTMLElement;

        if (nextView) {
          nextView.classList.remove('disabled-visibility', 'hidden-animated');
        }
      });
    }
  }

  previousStep(): void {
    const view = document.querySelector(`#${this.views[this.currentStep].selectorId}`) as HTMLElement;

    this.progressBar?.previousStep();
    this.currentStep--;
    this.transitionViews(view);

    if (this.currentStep === 0) {
      this.proceedText = 'Start';
    }
    else {
      this.proceedText = 'Next';
    }
  }

  nextStep(): void {
    const view = document.querySelector(`#${this.views[this.currentStep].selectorId}`) as HTMLElement;

    if (this.currentStep === this.views.length - 1) {
      this.transitionViews(view, false);
      this.completeSetup();
      return;
    }

    this.progressBar?.nextStep();
    this.currentStep++;
    this.transitionViews(view);

    if (this.currentStep === this.views.length - 1) {
      this.proceedText = 'Complete';
    }
    else {
      this.proceedText = 'Next';
    }
  }

  toggleChanged(event: {value: boolean | number, selector: string}) {
    event.value = (event.value) ? 1 : 0;
    this.toggleValues.find(toggle => toggle.selector == event.selector)!.value = event.value;
  }

  completeSetup() {
    const appSettings: AppSettings = {
      userId: this.authenticationService.getCurrentUser().value!.id,
      language: this.views.find(view => view['language'] !== undefined)!['language'],
      timezone: this.views.find(view => view['timezone'] !== undefined)!['timezone'],
      theme: this.views.find(view => view['theme'] !== undefined)!['theme'],
      fontsize: this.views.find(view => view['fontSize'] !== undefined)!['fontSize'],
      grid_theme: this.gridThemes[0].value,
      notification_sound: this.toggleValues.find(toggle => toggle.selector == 'notification_sound')!.value,
      notification_alerts: this.toggleValues.find(toggle => toggle.selector == 'notification_alerts')!.value,
      pin: this.views.find(view => view['pin'] !== undefined)!['pin'],
      lock_screen: this.toggleValues.find(toggle => toggle.selector == 'lock_screen')!.value,
      lock_screen_timeout: this.views.find(view => view['lock_screen_timeout'] !== undefined)!['lock_screen_timeout']
    };

    if (this.authenticationService.authorizePermission("ADMIN_SETTINGS")) {
      const adminSettings: AdminSettings = {
        company_type: this.views.find(view => view['businessType'] !== undefined)!['businessType']
      }

      this.configurationService.updateSettings(appSettings, adminSettings).subscribe({
        next: () => {
          this.signalRService.sendAction(SignalRAction.AdminSettingsUpdated, appSettings.userId);
          return;
        },
        error: () => {
          this.authenticationService.logout();
        }
      });
    }
    else {
      this.configurationService.updateSettings(appSettings, null).subscribe({
        next: () => {
          this.authenticationService.prepareApplication();
          return;
        },
        error: () => {
          this.authenticationService.logout();
        }
      });
    }
  }
}
