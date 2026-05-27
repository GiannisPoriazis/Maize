import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { ActiveModule, Module } from 'src/interfaces/module.interface';
import { User } from 'src/interfaces/user.interface';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { AppService, DataTable } from 'src/services/app.service';
import { AuthenticationService } from 'src/services/authentication.service';
import { ModuleService } from 'src/services/module.service';
import { NotificationService } from 'src/services/notification.service';

@Component({
  selector: 'app-modules',
  standalone: true,
  templateUrl: './modules.component.html',
  styleUrl: './modules.component.scss',
  providers: [
      TranslationPipe,
  ],
  imports: [
    TranslationPipe,
    CommonModule,
    ThemeDirective,
    BackgroundThemeDirective
  ]
})
export class ModulesComponent {
  private currentUser?: User;
  private fetchDataKeys: string[] = ['Module', 'ActiveModule'];
  public dataTable: BehaviorSubject<DataTable>;

  modules: Module[] = [];

  constructor(
    private appService: AppService,
    private moduleService: ModuleService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private notificationSoundPipe: NotificationSoundPipe,
    private translationPipe: TranslationPipe
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.appService.fetchData(this.dataTable, this.fetchDataKeys);
    this.setSubscriptions();   
  }

  setSubscriptions(): void {
    this.authenticationService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });

    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().Modules.length) {   
        this.modules = []; 
        this.dataTable.getValue().Modules.forEach(module => {
          if(!!this.dataTable.getValue().ActiveModules?.find(x => x.module_id === module.id)) {
            const activeModule: Module = {
              ...module,
              price: undefined
            };

            this.modules.push(activeModule);
          }
          else
            this.modules.push(module);
        });
      }
    });
  }

  enableModule(id: number): void {
    const activeModule: ActiveModule = {
      module_id: id,
      activated_by: this.currentUser!.id
    }

    this.moduleService.activateModule(activeModule).subscribe({
      next: () => {
        this.appService.fetchData(this.dataTable, this.fetchDataKeys);
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ModuleActivated), this.notificationSoundPipe.transform());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  disableModule(id: number): void {
    this.moduleService.deactivateModule(id).subscribe({
      next: () => {
        this.appService.fetchData(this.dataTable, this.fetchDataKeys);
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ModuleDisabled), this.notificationSoundPipe.transform());
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }
}
