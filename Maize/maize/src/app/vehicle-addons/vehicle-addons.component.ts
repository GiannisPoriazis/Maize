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
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';
import { VehicleAddon } from 'src/interfaces/vehicle.addon.interface';

@Component({
  selector: 'app-vehicle-addons',
  standalone: true,
  templateUrl: './vehicle-addons.component.html',
  styleUrl: './vehicle-addons.component.scss',
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
export class VehicleAddonsComponent {
  private gridData: any = [];

  rowData: any = [];
  colDefs?: (ColDef | ColGroupDef)[];

  private fetchDataKeys: string[] = ['VehicleAddons'];
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
    this.prepareGrid();
    this.setSubscriptions();   
  }

  prepareGrid(): void {
    this.colDefs = [
      { 
        headerGroupComponent: GridToolsComponent,
        headerClass: ["bg-black", "p-0"],
        children: [
          { field: "id", flex: 0.5, editable: false, resizable: false, filter: true, hide: true},
          { field: "title", flex: 1, headerName: 'Title', editable: true, resizable: false, filter: true },
          { field: "description", flex: 1, headerName: 'Description', editable: true, resizable: false, filter: true },
          { field: "max_quantity", flex: 1, headerName: 'Max Quantity', editable: true, resizable: false, filter: true },
          { field: "rate", flex: 1, headerName: 'Rate', editable: true, resizable: false, filter: true }
        ]
      }
    ];
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().VehicleAddons?.length) {
        this.refreshGrid();
      }
    });
  }

  refreshGrid(): void {
    this.rowData = [];

    this.dataTable.getValue().VehicleAddons?.forEach((vehicleAddon: VehicleAddon) => {
      this.rowData.push({
        id: vehicleAddon.id,
        title: vehicleAddon.title,
        description: vehicleAddon.description,
        max_quantity: vehicleAddon.max_quantity,
        rate: vehicleAddon.rate
      });
    });

    this.gridData = JSON.parse(JSON.stringify(this.rowData));
    this.gridService.refreshData();
  }

  updateData(data: any): void {
    const response = this.gridService.arrangeData(data, this.gridData);

    let newRows = 0;
    let valid = true;

    response.newData.forEach((data: VehicleAddon) => {
      if(!valid)
        return;

      if(!data.title) {
        //TO-DO add error notification
        return;
      }
      
      if(!data.max_quantity)
        data.max_quantity = 1;

      if(!data.rate && data.rate !== 0) {
        //TO-DO add error notification
        return;
      }

      this.fleetService.createVehicleAddon(data).subscribe({
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

      if(!data.title) {
        //TO-DO add error notification
        return;
      }
      
      if(!data.max_quantity)
        data.max_quantity = 1;

      if(!data.rate && data.rate !== 0) {
        //TO-DO add error notification
        return;
      }

      this.fleetService.updateVehicleAddon(data).subscribe({
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

      this.fleetService.deleteVehicleAddon(data['id']).subscribe({
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

