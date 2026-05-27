import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { CompanyAnnouncementComponent } from "../company-announcement/company-announcement.component";
import { CompanyAnnouncement, UpdateUserAnnouncements } from 'src/interfaces/company.announcement.interface';
import { FieldsetModule } from 'primeng/fieldset';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CompanyAnnouncementService } from 'src/services/company.announcement.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/services/notification.service';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { User } from 'src/interfaces/user.interface';
import { AuthenticationService } from 'src/services/authentication.service';

@Component({
  selector: 'app-company-announcements',
  standalone: true,
  imports: [
    DataViewModule,
    CommonModule,
    TranslationPipe,
    ThemeDirective,
    BackgroundThemeDirective,
    CompanyAnnouncementComponent,
    FieldsetModule,
    ToolbarModule,
    ButtonModule
],
  templateUrl: './company-announcements.component.html',
  styleUrl: './company-announcements.component.scss'
})
export class CompanyAnnouncementsComponent implements OnInit {
  private fetchDataKeys: string[] = ['CompanyAnnouncement'];
  public dataTable: BehaviorSubject<DataTable>;

  editorEnabled: boolean = false;
  selectedAnnouncement?: CompanyAnnouncement;
  currentUser?: User;
  
  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private companyAnnouncementService: CompanyAnnouncementService,
    private notificationService: NotificationService,
    private notificationSoundPipe: NotificationSoundPipe,
    private authenticationService: AuthenticationService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.refreshAnnouncements();
    this.setSubscriptions();
  }

  setSubscriptions(): void {
    this.authenticationService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });

    this.route.queryParams.subscribe(params => {
      if(!!params['id']) {
        const companyAnnouncement = params as CompanyAnnouncement;
        const request: UpdateUserAnnouncements = {
          userId: this.currentUser!.id,
          companyAnnouncementId: companyAnnouncement.id
        }
        
        this.companyAnnouncementService.readUserAnnouncement(request).subscribe({
          next: (company_announcement_id: number) => {
            this.currentUser!.company_announcement_id = company_announcement_id;
            this.authenticationService.updateUser(this.currentUser);
            this.selectedAnnouncement = companyAnnouncement;
          },
          error: (error: HttpErrorResponse) => {
            this.notificationService.showError(error, this.notificationSoundPipe.transform());
          }
        });
      }
    });
  }

  createAnnouncement(): void {
    this.editorEnabled = true;
  }

  refreshAnnouncements(): void {
    const fetchDataValues: FetchDataTableValues = {
      CompanyAnnouncement: {}
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
  }

  openAnnouncement(id: number): void {
    const request: UpdateUserAnnouncements = {
      userId: this.currentUser!.id,
      companyAnnouncementId: id
    }

    this.companyAnnouncementService.readUserAnnouncement(request).subscribe({
      next: (company_announcement_id: number) => {
        this.currentUser!.company_announcement_id = company_announcement_id;
        this.authenticationService.updateUser(this.currentUser);
        this.selectedAnnouncement = this.dataTable.getValue().CompanyAnnouncement.find(x => x.id === id);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  stopEdit() {
    this.selectedAnnouncement = undefined;
    this.editorEnabled = false;
    this.refreshAnnouncements();
  }
}
