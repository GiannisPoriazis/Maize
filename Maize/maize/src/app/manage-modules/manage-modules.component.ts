import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { Module } from 'src/interfaces/module.interface';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { DataTable, AppService } from 'src/services/app.service';
import { ModuleService } from 'src/services/module.service';
import { NotificationService } from 'src/services/notification.service';
import { DataViewModule } from 'primeng/dataview';
import { signal } from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-manage-modules',
  standalone: true,
  templateUrl: './manage-modules.component.html',
  styleUrl: './manage-modules.component.scss',
  providers: [
    TranslationPipe
  ],
  imports: [
    TranslationPipe,
    CommonModule,
    ThemeDirective,
    BackgroundThemeDirective,
    DataViewModule,
    CheckboxModule
  ]
})
export class ManageModulesComponent {
  private modulesToDisable: number[] = [];

  private fetchDataKeys: string[] = ['Module', 'ActiveModule'];
  public dataTable: BehaviorSubject<DataTable>;

  activeModules = signal<Module[]>([]);

  constructor(
    private appService: AppService,
    private moduleService: ModuleService,
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
    this.dataTable.subscribe(() => {
      this.activeModules.set([]);
      if(!!this.dataTable.getValue().ActiveModules?.length && !!this.dataTable.getValue().Modules.length) {   
        let activeMods: Module[] = [];
        this.dataTable.getValue().ActiveModules?.forEach(activeModule => {
          const module: Module = this.dataTable.getValue().Modules.find(x => x.id === activeModule.module_id)!;
          activeMods.push(module);
        });

        this.activeModules.set(activeMods);
      }
    });
  }

  toggleSelection(id: number): void {
    if(this.modulesToDisable.includes(id))
      this.modulesToDisable.splice(this.modulesToDisable.indexOf(id), 1);
    else
      this.modulesToDisable.push(id);
  }

  disableModules(): void {
    this.modulesToDisable.forEach(id => {
      this.disableModule(id);
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
