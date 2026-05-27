import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { EditorModule } from 'primeng/editor';
import { CardModule } from 'primeng/card';
import { CompanyAnnouncement } from 'src/interfaces/company.announcement.interface';
import { CompanyAnnouncementService } from 'src/services/company.announcement.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication.service';
import { User } from 'src/interfaces/user.interface';
import { NotificationService } from 'src/services/notification.service';
import { NotificationPhrases, NotificationType, SignalRAction } from 'src/refData/ref-data';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { FieldsetModule } from 'primeng/fieldset';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { ModalComponent } from '../modal/modal.component';
import { SignalRService } from 'src/services/signalR.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-company-announcement',
  standalone: true,
  imports: [
    CommonModule,
    TranslationPipe,
    ThemeDirective,
    BackgroundThemeDirective,
    EditorModule,
    CardModule,
    ReactiveFormsModule,
    FieldsetModule,
    ModalComponent
  ],
  providers: [
    TranslationPipe
  ],
  templateUrl: './company-announcement.component.html',
  styleUrl: './company-announcement.component.scss'
})
export class CompanyAnnouncementComponent implements OnInit, AfterViewInit {
  private fetchDataKeys: string[] = ['User'];
  public dataTable: BehaviorSubject<DataTable>;
  
  @Input() announcement?: CompanyAnnouncement;
  @Output() backActionEvent = new EventEmitter();

  @ViewChild("AnnouncementData") announcementData!: ElementRef;
  announcementForm!: FormGroup;
  author: string = "";
  editorMode: boolean = false;
  
  currentUser?: User;

  constructor(
    private companyAnnouncementService: CompanyAnnouncementService,
    private authenticationService: AuthenticationService,
    private notificationService: NotificationService,
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe,
    private appService: AppService,
    private signalRService: SignalRService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.initForm();

    const fetchDataValues: FetchDataTableValues = {
      User: {
        id: this.announcement?.author_id
      }
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
    this.setSubscriptions();
  }

  ngAfterViewInit(): void {
    if(!!this.announcement)
      this.announcementData.nativeElement.innerHTML = this.announcement.data;
  }

  setSubscriptions() {
    this.authenticationService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });

    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().User.length)
        this.author = `${this.dataTable.getValue().User[0].first_name} ${this.dataTable.getValue().User[0].last_name}`;
    });
  }

  initForm() {  
    if(!this.announcement)  
      this.announcementForm = new FormGroup({
        'announcement_title': new FormControl(null, Validators.required),
        'announcement_data': new FormControl(null, Validators.required)
      });
    else 
      this.announcementForm = new FormGroup({
        'announcement_title': new FormControl(this.announcement.title, Validators.required),
        'announcement_data': new FormControl(this.announcement.data, Validators.required)
      });
  }

  onSubmit(): void {
    if(this.editorMode) {
      this.editAnnouncement();
    }
    else {
      this.createAnnouncement();
    }
  }

  editAnnouncement() {
    const { announcement_title, announcement_data } = this.announcementForm.controls;
    const updatedAnnouncement: CompanyAnnouncement = {
      id: this.announcement!.id,
      title: announcement_title.value,
      data: announcement_data.value,
      created_at: this.announcement!.created_at,
      author_id: this.announcement!.author_id
    };

    this.companyAnnouncementService.updateAnnouncement(updatedAnnouncement).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.CompanyAnnouncementUpdated), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  createAnnouncement() {
    const { announcement_title, announcement_data } = this.announcementForm.controls;
    const newAnnouncement: CompanyAnnouncement = {
      id: 0,
      title: announcement_title.value,
      data: announcement_data.value,
      created_at: '',
      author_id: this.currentUser!.id
    };

    this.companyAnnouncementService.createAnnouncement(newAnnouncement).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.CompanyAnnouncementCreated), this.notificationSoundPipe.transform());
        this.signalRService.sendAction(SignalRAction.AnnouncementCreated, this.currentUser!.id);
        this.backAction();
        return;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  backAction() {
    this.backActionEvent.emit();
    this.announcement = undefined;
  }

  editAction() {
    this.editorMode = true;
  }

  deleteAction() {
    this.companyAnnouncementService.deleteAnnouncement(this.announcement!.id).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.CompanyAnnouncementDeleted), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }
}
