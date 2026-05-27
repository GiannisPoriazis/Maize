import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ColGroupDef } from '@ag-grid-community/core/dist/types/src/entities/colDef';
import { ColDef } from 'ag-grid-community';

import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { GridService } from 'src/services/grid.service';
import { NotificationService } from 'src/services/notification.service';
import { GridToolsComponent } from '../grid-tools/grid-tools.component';
import { GridComponent } from '../grid/grid.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ISelectCellEditorParams } from '@ag-grid-community/core/dist/types/src/rendering/cellEditors/selectCellEditor';
import { VehicleType } from 'src/interfaces/vehicle.type.interface';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-vehicle-category',
  standalone: true,
  templateUrl: './vehicle-category.component.html',
  styleUrl: './vehicle-category.component.scss',
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
export class VehicleCategoryComponent {
  private gridData: any;

  rowData: any = [];
  colDefs?: (ColDef | ColGroupDef)[];

  private fetchDataKeys: string[] = ['VehicleType', 'VehicleCategory'];
  public dataTable: BehaviorSubject<DataTable>;

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
    this.appService.fetchData(this.dataTable, this.fetchDataKeys);
    this.setSubscriptions();   
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().VehicleType.length && !!this.dataTable.getValue().VehicleCategory.length) {
        this.colDefs = [
          { 
            headerGroupComponent: GridToolsComponent,
            headerClass: ["bg-black", "p-0"],
            children: [
              { field: "id", flex: 0.5, editable: false, resizable: false, filter: true },
              { field: "description", flex: 1, headerName: 'Category', editable: true, resizable: false, filter: true },
              { field: "vehicle_type_id", flex: 1, headerName: 'Type', editable: true, resizable: false, filter: true, cellEditor: "agSelectCellEditor", cellEditorParams: { values: this.dataTable.getValue().VehicleType.map((type: VehicleType) => type.description), valueListGap: 10, valueListMaxHeight: 120 } as ISelectCellEditorParams }
            ]
          }
        ];

        this.refreshGrid();
      }
    });
  }

  refreshGrid(): void {
    this.rowData = [];

    this.dataTable.getValue().VehicleCategory.forEach((category) => {
      this.rowData.push({
        id: category.id,
        description: category.description,
        vehicle_type_id: this.dataTable.getValue().VehicleType.find((type: VehicleType) => type.id === category.vehicle_type_id)?.description
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

      if(!data["vehicle_type_id"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleTypeMissing), this.notificationSoundPipe.transform());
        return;
      }
      else
        data["vehicle_type_id"] = this.dataTable.getValue().VehicleType.find((type: VehicleType) => type.description === data["vehicle_type_id"])?.id;

      this.fleetService.createVehicleCategory(data).subscribe({
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

      if(!data["vehicle_type_id"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleTypeMissing), this.notificationSoundPipe.transform());
        return;
      }
      else
        data["vehicle_type_id"] = this.dataTable.getValue().VehicleType.find((type: VehicleType) => type.description === data["vehicle_type_id"])?.id;

      this.fleetService.updateVehicleCategory(data).subscribe({
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

      this.fleetService.deleteVehicleCategory(data['id']).subscribe({
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
}
