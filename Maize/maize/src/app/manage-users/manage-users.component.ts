import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';

import { GridComponent } from '../grid/grid.component';
import { UserService } from 'src/services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/services/notification.service';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { User } from 'src/interfaces/user.interface';
import { CommonModule } from '@angular/common';
import { UserComponent } from '../user/user.component';
import { ConfigurationService } from 'src/services/configuration.service';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';

@Component({
  standalone: true,
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  providers: [
    TranslationPipe
  ],
  imports: [
    GridComponent,
    FormsModule,
    CommonModule,
    UserComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ]
})
export class ManageUsersComponent {
  selectedUser?: User;
  rowData: any = [];
  colDefs: ColDef[] = [
    { field: "id", hide: true },
    { field: "username", headerName: 'Username' },
    { field: "password", hide: true },
    { field: "email", headerName: 'E-mail' },
    { field: "first_name", headerName: 'First name' },
    { field: "last_name", headerName: 'Last name' },
    { field: "role", headerName: 'Role' },
  ];

  private foundUsers?: User[] = [];

  constructor(
    private userService: UserService, 
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private configurationService: ConfigurationService,
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  onSubmit(form: NgForm): void {
    this.userService.findUsers(form.value.SearchUser).subscribe({
      next: (res: User[]) => {
        this.foundUsers = res;
        this.rowData = [];

        res.forEach((user) => {
          this.rowData.push({
            id: user.id,
            username: user.username,
            password: user.password,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: this.translationPipe.transform(this.configurationService.userRoles.value?.find(role => role.id === user.role)?.name)
          })
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.rowData = [];
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.SearchUserNotFound), this.notificationSoundPipe.transform());
        }
        else {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      }
    });
  }

  selectUser(params: RowDoubleClickedEvent) {
    const user = this.foundUsers?.find(u => u.id === params.data.id);

    this.selectedUser = {
      id: user!.id,
      username: user!.username,
      password: user!.password,
      email: user!.email,
      first_name: user!.first_name,
      last_name: user!.last_name,
      role: user!.role,
      token: ''
    }
  }

  stopEdit() {
    this.foundUsers = [];
    this.rowData = [];
    this.selectedUser = undefined;
  }
}
