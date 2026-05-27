import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { NotificationService } from 'src/services/notification.service';
import { ModalComponent } from '../modal/modal.component';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { Client } from 'src/interfaces/client.interface';
import { ClientService } from 'src/services/client.service';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';

@Component({
  standalone: true,
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
  providers: [
    TranslationPipe,
    DatePipe
  ],
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    DatepickerComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ]
})
export class ClientComponent implements OnInit {
  @Input() client?: Client;
  @Output() backActionEvent = new EventEmitter();

  public clientForm!: FormGroup;
  public pageTitle?: string;

  constructor(
    private clientService: ClientService,
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe, 
    private notificationSoundPipe: NotificationSoundPipe,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    if(!this.client)
      this.pageTitle = 'new_client_page_title';
    else
      this.pageTitle = 'edit_client_page_title';

    this.initForm();
  }

  initForm() {
    if(!this.client) {
      this.clientForm = new FormGroup({
        'firstname': new FormControl(null, Validators.required),
        'lastname': new FormControl(null, Validators.required),
        'email': new FormControl(null, [Validators.required, Validators.email]),
        'mobile_phone': new FormControl(null),
        'birth_date': new FormControl(null),
        'tax_id': new FormControl(null)
      });

      return;
    }

    let birth_date: Date;

    if(this.client.birth_date)
      birth_date = moment(this.client.birth_date, "DD/MM/YYYY").toDate();
    
    this.clientForm = new FormGroup({
      'firstname': new FormControl(this.client.first_name, Validators.required),
      'lastname': new FormControl(this.client.last_name, Validators.required),
      'email': new FormControl(this.client.email, [Validators.required, Validators.email]),
      'mobile_phone': new FormControl(this.client.mobile_phone),
      'birth_date': new FormControl((this.client.birth_date) ? new NgbDate(birth_date!.getFullYear(), birth_date!.getMonth() + 1, birth_date!.getDate()) : null),
      'tax_id': new FormControl(this.client.taxId)
    });
  }

  onSubmit() {
    let date: Date;

    if(this.clientForm.value.birth_date)
      date = new Date(this.clientForm.value.birth_date['year'], this.clientForm.value.birth_date['month'] - 1, this.clientForm.value.birth_date['day']);

    const client: Client = {
      id: !this.client ? 0 : this.client.id,
      first_name: this.clientForm.value.firstname,
      last_name: this.clientForm.value.lastname,
      email: this.clientForm.value.email,
      mobile_phone: this.clientForm.value.mobile_phone,
      birth_date: (this.clientForm.value.birth_date) ? this.datePipe.transform(date!, 'dd/MM/yyyy')!.toString() : undefined,
      taxId: this.clientForm.value.tax_id
    }

    if(!this.client) {
      this.createClient(client);
      return;
    }

    this.updateClient(client);
  }

  createClient(client: Client) {
    this.clientService.createClient(client).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ClientCreated), this.notificationSoundPipe.transform());
        this.clientForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  updateClient(client: Client) {
    this.clientService.updateClient(client).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ClientUpdated), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  deleteClient() {
    const clientId: number = this.client!.id;

    this.clientService.deleteClient(clientId).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.ClientDeleted), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  backAction() {
    this.backActionEvent.emit();
    this.client = undefined;
  }
}
