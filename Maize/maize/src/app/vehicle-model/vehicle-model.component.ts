import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { GridComponent } from '../grid/grid.component';
import { ColDef, ColGroupDef, ISelectCellEditorParams } from '@ag-grid-community/core';
import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { VehicleCategory } from 'src/interfaces/vehicle.category.interface';
import { NotificationType, NotificationPhrases } from 'src/refData/ref-data';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { GridService } from 'src/services/grid.service';
import { NotificationService } from 'src/services/notification.service';
import { GridToolsComponent } from '../grid-tools/grid-tools.component';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';

@Component({
  selector: 'app-vehicle-model',
  standalone: true,
  templateUrl: './vehicle-model.component.html',
  styleUrl: './vehicle-model.component.scss',
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
export class VehicleModelComponent {
  private subscription?: Subscription; 
  private gridData: any;

  rowData: any = [];
  colDefs?: (ColDef | ColGroupDef)[];

  private fetchDataKeys: string[] = ['VehicleType', 'VehicleCategory', 'VehicleModel'];
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
    const fetchDataValues: FetchDataTableValues = {
      VehicleType: {},
      VehicleCategory: {},
      VehicleModel: {}
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
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
              { field: "description", flex: 1, headerName: 'Model', editable: true, resizable: false, filter: true },
              { field: "vehicle_category_id", flex: 1, headerName: 'Category', editable: true, resizable: false, filter: true, cellEditor: "agSelectCellEditor", cellEditorParams: { values: this.dataTable.getValue().VehicleCategory.map((category: VehicleCategory) => category.description), valueListGap: 10, valueListMaxHeight: 120 } as ISelectCellEditorParams }
            ]
          }
        ];
    
        this.refreshGrid();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  refreshGrid(): void {
    this.rowData = [];

    this.dataTable.getValue().VehicleModel.forEach((model) => {
      this.rowData.push({
        id: model.id,
        description: model.description,
        vehicle_category_id: this.dataTable.getValue().VehicleCategory.find((category: VehicleCategory) => category.id === model.vehicle_category_id)!.description
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

      if(!data["vehicle_category_id"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleCategoryMissing), this.notificationSoundPipe.transform());
        return;
      }
      else
        data["vehicle_category_id"] = this.dataTable.getValue().VehicleCategory.find((type: VehicleCategory) => type.description === data["vehicle_category_id"])!.id;

      this.fleetService.createVehicleModel(data).subscribe({
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

      if(!data["vehicle_category_id"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleCategoryMissing), this.notificationSoundPipe.transform());
        return;
      }
      else
        data["vehicle_category_id"] = this.dataTable.getValue().VehicleCategory.find((type: VehicleCategory) => type.description === data["vehicle_category_id"])!.id;

      this.fleetService.updateVehicleModel(data).subscribe({
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

      this.fleetService.deleteVehicleModel(data['id']).subscribe({
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
