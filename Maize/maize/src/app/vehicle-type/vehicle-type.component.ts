import { ColDef } from 'ag-grid-community';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ColGroupDef } from '@ag-grid-community/core/dist/types/src/entities/colDef';

import { VehicleType } from 'src/interfaces/vehicle.type.interface';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { NotificationService } from 'src/services/notification.service';
import { GridComponent } from '../grid/grid.component';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { GridToolsComponent } from '../grid-tools/grid-tools.component';
import { GridService } from 'src/services/grid.service';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vehicle-type',
  standalone: true,
  templateUrl: './vehicle-type.component.html',
  styleUrl: './vehicle-type.component.scss',
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

export class VehicleTypeComponent implements OnInit {
  private gridData: any;

  private fetchDataKeys: string[] = ['VehicleType'];
  public dataTable: BehaviorSubject<DataTable>;

  rowData: any = [];
  colDefs: (ColDef | ColGroupDef)[] = [
    { 
      headerGroupComponent: GridToolsComponent,
      headerClass: ["bg-black", "p-0"],
      children: [
        { field: "id", flex: 1, editable: false, resizable: false, filter: true },
        { field: "description", headerName: 'Type', flex: 1, editable: true, resizable: false, filter: true },
      ]
    }
  ];

  constructor(
    private fleetService: CarRentalFleetService, 
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe,
    private gridService: GridService,
    private appService: AppService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    const fetchDataValues: FetchDataTableValues = {
      VehicleType: {}
    }
    
    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
    this.setSubscriptions();   
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().VehicleType.length) {
        this.refreshGrid();
      }
    });
  }

  refreshGrid(): void {
    this.rowData = [];

    this.dataTable.getValue().VehicleType.forEach((type) => {
      this.rowData.push({
        id: type.id,
        description: type.description
      });
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

      this.fleetService.createVehicleType(data).subscribe({
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

      this.fleetService.updateVehicleType(data).subscribe({
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

      this.fleetService.deleteVehicleType(data['id']).subscribe({
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
    this.refreshGrid();
  }
}
