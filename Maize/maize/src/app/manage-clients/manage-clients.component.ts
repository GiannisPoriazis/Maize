import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ColDef } from 'ag-grid-community';

import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationService } from 'src/services/notification.service';
import { GridComponent } from '../grid/grid.component';
import { ClientService } from 'src/services/client.service';
import { Client } from 'src/interfaces/client.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { RowDoubleClickedEvent } from '@ag-grid-community/core/dist/types/src/events';
import { ClientComponent } from '../client/client.component';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';

@Component({
  selector: 'app-manage-clients',
  standalone: true,
  templateUrl: './manage-clients.component.html',
  styleUrl: './manage-clients.component.scss',
  imports: [
    FormsModule,
    CommonModule,
    GridComponent,
    ClientComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ],
  providers: [
    TranslationPipe
  ]
})
export class ManageClientsComponent {
  private foundClients?: Client[] = [];
  
  selectedClient?: Client;
  rowData: any = [];
  colDefs: ColDef[] = [
    { field: "id", hide: true },
    { field: "first_name", headerName: 'First name' },
    { field: "last_name", headerName: 'Last name' },
    { field: "email", headerName: 'E-mail' },
    { field: "mobile_phone", headerName: 'Mobile Phone' },
    { field: "taxId", headerName: 'Tax Id' },
    { field: "birth_date", headerName: 'Date of Birth' },
  ];

  constructor(
    private clientService: ClientService, 
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  onSubmit(form: NgForm): void {
    this.clientService.findClients(form.value.SearchClient).subscribe({
      next: (res: Client[]) => {
        this.foundClients = res;
        this.rowData = [];

        res.forEach((client) => {
          this.rowData.push({
            id: client.id,
            email: client.email,
            mobile_phone: client.mobile_phone,
            first_name: client.first_name,
            last_name: client.last_name,
            taxId: client.taxId,
            birth_date: client.birth_date
          })
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.rowData = [];
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.SearchClientNotFound), this.notificationSoundPipe.transform());
        }
        else {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      }
    });
  }

  selectClient(params: RowDoubleClickedEvent) {
    const client = this.foundClients?.find(client => client.id === params.data.id);

    this.selectedClient = {
      id: client!.id,
      email: client!.email,
      mobile_phone: client!.mobile_phone,
      first_name: client!.first_name,
      last_name: client!.last_name,
      taxId: client?.taxId,
      birth_date: client?.birth_date
    }
  }

  stopEdit() {
    this.foundClients = [];
    this.rowData = [];
    this.selectedClient = undefined;
  }
}
