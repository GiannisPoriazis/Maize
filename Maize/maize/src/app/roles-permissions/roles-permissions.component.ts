import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { GridComponent } from '../grid/grid.component';
import { ColDef, ColGroupDef } from '@ag-grid-community/core';
import { BehaviorSubject } from 'rxjs';
import { AppService, DataTable } from 'src/services/app.service';
import { GridToolsComponent } from '../grid-tools/grid-tools.component';
import { GridService } from 'src/services/grid.service';
import { NotificationService } from 'src/services/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { UserService } from 'src/services/user.service';
import { UserRolePermissions } from 'src/interfaces/user.role.interface';

export const defaultRoles: number[] = [1,2];

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  templateUrl: './roles-permissions.component.html',
  styleUrl: './roles-permissions.component.scss',
  providers: [
    TranslationPipe,
    NotificationSoundPipe
  ],
  imports: [
    GridComponent,
    FormsModule,
    CommonModule,
    ThemeDirective,
    BackgroundThemeDirective
  ]
})

export class RolesPermissionsComponent {
  private gridData: any;

  private fetchDataKeys: string[] = ['Permission', 'Role'];
  public dataTable: BehaviorSubject<DataTable>;

  rowData: any = [];
  colDefs: (ColDef | ColGroupDef)[] = [
    { 
      headerGroupComponent: GridToolsComponent,
      headerGroupComponentParams: { disabledDeletionRows: defaultRoles },
      headerClass: ["bg-black", "p-0"],
      children: [
        { field: "id", headerName: 'Id', editable: false, resizable: true, filter: true },
        { 
          field: "role", 
          headerName: 'Role', 
          editable: (params) => {
            return !defaultRoles.includes(params.data.id);
          }, 
          resizable: true, 
          filter: true
        },
      ]
    }
  ];

  constructor(
    private userService: UserService,
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe,
    private gridService: GridService,
    private appService: AppService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {    
    this.appService.fetchData(this.dataTable, this.fetchDataKeys);
    this.setSubscriptions();   
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().Permission.length && !!this.dataTable.getValue().Role.length) {
        this.refreshGrid();
      }
    });
  }

  refreshGrid(): void {
    this.rowData = [];

    this.dataTable.getValue().Permission.forEach((permission) => {
      const columnExists = this.colDefs.some(group => 
        'children' in group && Array.isArray(group.children) && 
        group.children.some(child => child.headerName === permission.name)
      );
    
      if (!columnExists) {
        this.colDefs = this.colDefs.map(group => {
          if ('children' in group && Array.isArray(group.children)) {
            return {
              ...group,
              children: [...group.children, {
                field: permission.name,
                headerName: permission.name,
                cellRenderer: 'agCheckboxCellRenderer', 
                cellEditor: 'agCheckboxCellEditor', 
                valueGetter: (params) => params.data[permission.name] ?? false,
                editable: (params) => {
                  return !defaultRoles.includes(params.data.id);
                },
                resizable: true,
                filter: true
              }]
            };
          }
          return group;
        });
      }

      let existingRow = this.rowData.find((row: any) => row.id === permission.roleId);

      if (!existingRow) {
          existingRow = { 
            id: permission.roleId,
            role: this.dataTable.getValue().Role.find(role => role.id === permission.roleId)?.name 
          };
          this.rowData.push(existingRow);
      }

      existingRow[permission.name] = true;
    });

    this.gridData = JSON.parse(JSON.stringify(this.rowData));
    this.gridService.refreshData();
  }

  updateData(data: any): void {
    const response = this.gridService.arrangeData(data, this.gridData);

    let newRows = 0;
    let valid = true;

    response.newData.forEach((data: any) => {
      if(!valid)
        return;

      const reqData: UserRolePermissions = {
        id: 0,
        name: data['role'],
        permissions: []
      }

      for (const [key, value] of Object.entries(data)) {
        if(key === 'id' || key === 'role')
          continue;

        if(!!value)
          reqData.permissions.push(key);
      }

      this.userService.createUserRole(reqData).subscribe({
        next: () => {
          newRows++;
          if(newRows >= response.newData.length && !response.updatedData.length && !response.deletedData.length)
            this.hasCompleted();
        },
        error: (error: HttpErrorResponse) => {
          valid = false;
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      });
    });
    
    let updatedRows = 0;

    response.updatedData.forEach((data: any) => {
      if(!valid)
        return;

      const reqData: UserRolePermissions = {
        id: +data['id'],
        name: data['role'],
        permissions: []
      }

      for (const [key, value] of Object.entries(data)) {
        if(key === 'id' || key === 'role')
          continue;

        if(!!value)
          reqData.permissions.push(key);
      }

      this.userService.updateUserRole(reqData).subscribe({
        next: () => {
          updatedRows++;
          if(updatedRows >= response.updatedData.length && !response.deletedData.length)
            this.hasCompleted();
        },
        error: (error: HttpErrorResponse) => {
          valid = false;
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      });
    });

    let deletedRows = 0;

    response.deletedData.forEach((data: any) => {
      if(!valid)
        return;

      this.userService.deleteUserRole(data['id']).subscribe({
        next: () => {
          deletedRows++;
          if(deletedRows >= response.deletedData.length)
            this.hasCompleted();
        },
        error: (error: HttpErrorResponse) => {
          valid = false;
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      });
    });
  }

  hasCompleted(): void {
    this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.SuccessfulUpdate), this.notificationSoundPipe.transform());
    this.appService.fetchData(this.dataTable, this.fetchDataKeys);
  }

  saveAction(): void {
    this.gridService.updateData();
  }
}
