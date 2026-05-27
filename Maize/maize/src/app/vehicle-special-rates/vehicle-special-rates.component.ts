import { Component } from '@angular/core';
import { ColGroupDef } from '@ag-grid-community/core/dist/types/src/entities/colDef';
import { ColDef } from 'ag-grid-community';

import { TranslationPipe } from 'src/pipes/translation.pipe';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { GridComponent } from '../grid/grid.component';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';
import { GridService } from 'src/services/grid.service';
import { GridToolsComponent } from '../grid-tools/grid-tools.component';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { NotificationService } from 'src/services/notification.service';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GridTooltipHeaderComponent } from '../grid-tooltip-header/grid-tooltip-header.component';
import { VehicleSpecialRate } from 'src/interfaces/vehicle.special.rate.interface';


@Component({
  selector: 'app-vehicle-special-rates',
  standalone: true,
  templateUrl: './vehicle-special-rates.component.html',
  styleUrl: './vehicle-special-rates.component.css',
  providers: [
    TranslationPipe,
    NotificationSoundPipe
  ],
  imports: [
    TranslationPipe,
    ThemeDirective,
    BackgroundThemeDirective,
    GridComponent,
  ]
})
export class VehicleSpecialRatesComponent {
  vehicleGridData: any = [];
  modelGridData: any = [];
  categoryGridData: any = [];
  typeGridData: any = [];

  vehicleRowData: any = [];
  modelRowData: any = [];
  categoryRowData: any = [];
  typeRowData: any = [];
  vehicleColDefs?: (ColDef | ColGroupDef)[];
  modelColDefs?: (ColDef | ColGroupDef)[];
  categoryColDefs?: (ColDef | ColGroupDef)[];
  typeColDefs?: (ColDef | ColGroupDef)[];

  private fetchDataKeys: string[] = ['VehicleSpecialRates'];
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
      VehicleSpecialRates: {},
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
    this.initGrids();
    this.setSubscriptions();   
  }

  initGrids(): void {
    this.vehicleColDefs = [
      { 
        headerGroupComponent: GridToolsComponent,
        headerGroupComponentParams: { disableSaveAction: true },
        headerClass: ["bg-black", "p-0"],
        children: [
          { field: "id", hide: true },
          { field: "vehicle_id", flex: 1, headerName: 'Vehicle Id', editable: true, resizable: false, filter: true },
          { field: "discount", flex: 1, headerName: 'Discount', editable: true, resizable: false, filter: true },
          { field: "markup", flex: 1, headerName: 'Markup', editable: true, resizable: false, filter: true },
          { 
            field: "isPercentage", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Percentage',
              tooltip: 'vehicle_special_rate_percentage_tooltip'
            },
            cellRenderer: 'agCheckboxCellRenderer', 
            cellEditor: 'agCheckboxCellEditor', 
            valueGetter: (params) => params.data.isPercentage ?? false,
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "start_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Start Date',
              tooltip: 'vehicle_special_rate_start_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "expiry_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Expiry Date',
              tooltip: 'vehicle_special_rate_expiry_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          }
        ]
      }
    ];

    this.modelColDefs = [
      { 
        headerGroupComponent: GridToolsComponent,
        headerGroupComponentParams: { disableSaveAction: true },
        headerClass: ["bg-black", "p-0"],
        children: [
          { field: "id", hide: true },
          { field: "vehicle_model_id", flex: 1, headerName: 'Model Id', editable: true, resizable: false, filter: true },
          { field: "discount", flex: 1, headerName: 'Discount', editable: true, resizable: false, filter: true },
          { field: "markup", flex: 1, headerName: 'Markup', editable: true, resizable: false, filter: true },
          { 
            field: "isPercentage", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Percentage',
              tooltip: 'vehicle_special_rate_percentage_tooltip'
            },
            cellRenderer: 'agCheckboxCellRenderer', 
            cellEditor: 'agCheckboxCellEditor', 
            valueGetter: (params) => params.data.isPercentage ?? false,
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "start_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Start Date',
              tooltip: 'vehicle_special_rate_start_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "expiry_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Expiry Date',
              tooltip: 'vehicle_special_rate_expiry_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          }
        ]
      }
    ];

    this.categoryColDefs = [
      { 
        headerGroupComponent: GridToolsComponent,
        headerGroupComponentParams: { disableSaveAction: true },
        headerClass: ["bg-black", "p-0"],
        children: [
          { field: "id", hide: true },
          { field: "vehicle_category_id", flex: 1, headerName: 'Category Id', editable: true, resizable: false, filter: true },
          { field: "discount", flex: 1, headerName: 'Discount', editable: true, resizable: false, filter: true },
          { field: "markup", flex: 1, headerName: 'Markup', editable: true, resizable: false, filter: true },
          { 
            field: "isPercentage", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Percentage',
              tooltip: 'vehicle_special_rate_percentage_tooltip'
            },
            cellRenderer: 'agCheckboxCellRenderer', 
            cellEditor: 'agCheckboxCellEditor', 
            valueGetter: (params) => params.data.isPercentage ?? false,
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "start_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Start Date',
              tooltip: 'vehicle_special_rate_start_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "expiry_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Expiry Date',
              tooltip: 'vehicle_special_rate_expiry_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          }
        ]
      }
    ];

    this.typeColDefs = [
      { 
        headerGroupComponent: GridToolsComponent,
        headerGroupComponentParams: { disableSaveAction: true },
        headerClass: ["bg-black", "p-0"],
        children: [
          { field: "id", hide: true },
          { field: "vehicle_type_id", flex: 1, headerName: 'Type Id', editable: true, resizable: false, filter: true },
          { field: "discount", flex: 1, headerName: 'Discount', editable: true, resizable: false, filter: true },
          { field: "markup", flex: 1, headerName: 'Markup', editable: true, resizable: false, filter: true },
          { 
            field: "isPercentage", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Percentage',
              tooltip: 'vehicle_special_rate_percentage_tooltip'
            },
            cellRenderer: 'agCheckboxCellRenderer', 
            cellEditor: 'agCheckboxCellEditor', 
            valueGetter: (params) => params.data.isPercentage ?? false,
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "start_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Start Date',
              tooltip: 'vehicle_special_rate_start_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          },
          { 
            field: "expiry_date", 
            flex: 1, 
            headerComponent: GridTooltipHeaderComponent, 
            headerComponentParams: {
              value: 'Expiry Date',
              tooltip: 'vehicle_special_rate_expiry_date_tooltip'
            },
            cellEditor: 'agDateCellEditor',
            valueFormatter: (params) => {
              if (!params.value) return '';
              const date = new Date(params.value);
              const day = String(date.getDate()).padStart(2, '0');
              const month = String(date.getMonth() + 1).padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            },
            valueParser: (params) => {
              const input = params.newValue;
              const [day, month, year] = input.split('/');
              return `${year}-${month}-${day}`;
            },
            editable: true, 
            resizable: false, 
            filter: true 
          }
        ]
      }
    ];
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().VehicleSpecialRate.length) {
        this.refreshGrid();
      }
    });
  }

  refreshGrid(): void {
    this.vehicleRowData = [];
    this.modelRowData = [];
    this.categoryRowData = [];
    this.typeRowData = [];

    this.dataTable.getValue().VehicleSpecialRate.forEach((rate) => {
      if(!!rate.vehicle_id)
        this.vehicleRowData.push({
          id: rate.id,
          vehicle_id: rate.vehicle_id,
          discount: rate.discount,
          markup: rate.markup,
          isPercentage: rate.isPercentage === 1 ? true : false,
          start_date: this.parseDate(rate.start_date),
          expiry_date: rate.expiry_date,
        });

      if(!!rate.vehicle_model_id)
        this.modelRowData.push({
          id: rate.id,
          vehicle_model_id: rate.vehicle_model_id,
          discount: rate.discount,
          markup: rate.markup,
          isPercentage: rate.isPercentage === 1 ? true : false,
          start_date: this.parseDate(rate.start_date),
          expiry_date: rate.expiry_date,
        });

      if(!!rate.vehicle_category_id)
        this.categoryRowData.push({
          id: rate.id,
          vehicle_category_id: rate.vehicle_category_id,
          discount: rate.discount,
          markup: rate.markup,
          isPercentage: rate.isPercentage === 1 ? true : false,
          start_date: this.parseDate(rate.start_date),
          expiry_date: rate.expiry_date,
        });

      if(!!rate.vehicle_type_id)
        this.typeRowData.push({
          id: rate.id,
          vehicle_type_id: rate.vehicle_type_id,
          discount: rate.discount,
          markup: rate.markup,
          isPercentage: rate.isPercentage === 1 ? true : false,
          start_date: this.parseDate(rate.start_date),
          expiry_date: rate.expiry_date,
        });
    });

    this.vehicleGridData = JSON.parse(JSON.stringify(this.vehicleRowData));
    this.modelGridData = JSON.parse(JSON.stringify(this.modelRowData));
    this.categoryGridData = JSON.parse(JSON.stringify(this.categoryRowData));
    this.typeGridData = JSON.parse(JSON.stringify(this.typeRowData));
    this.gridService.refreshData();
  }
  
  updateData(data: any, gridData: any, idField: string): void {
    const response = this.gridService.arrangeData(data, gridData);

    let newRows = 0;
    let valid = true;

    response.newData.forEach((data: any) => {
      if(!valid)
        return;

      if(!data[idField]) {
        switch(idField) {
          case 'vehicle_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleIdMissing), this.notificationSoundPipe.transform());
            break;
          case 'vehicle_model_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleModelIdMissing), this.notificationSoundPipe.transform());
            break;
          case 'vehicle_category_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleCategoryIdMissing), this.notificationSoundPipe.transform());
            break;
          case 'vehicle_type_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleTypeIdMissing), this.notificationSoundPipe.transform());
            break;
        }
        return;
      }

      if(!!data["discount"] && !!data["markup"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateConflictingOffer), this.notificationSoundPipe.transform());
        return;
      }

      if(!data["start_date"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateStartDateMissing), this.notificationSoundPipe.transform());
        return;
      }
      
      const date = new Date(data["start_date"]);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      data["start_date"] = `${day}/${month}/${year}`;

      if(!!data["expiry_date"]) {
        const expiryDate = new Date(data["expiry_date"]);
        const expiryDay = String(expiryDate.getDate()).padStart(2, '0');
        const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
        const expiryYear = expiryDate.getFullYear();
        data["expiry_date"] = `${expiryDay}/${expiryMonth}/${expiryYear}`;
      }

      if(!data['isPercentage'])
        data['isPercentage'] = 0;
      else
        data['isPercentage'] = !!data['isPercentage'] ? 1 : 0;

      const reqData: VehicleSpecialRate = {
        id: 0,
        vehicle_id: +data['vehicle_id'],
        vehicle_model_id: +data['vehicle_model_id'],
        vehicle_category_id: +data['vehicle_category_id'],
        vehicle_type_id: +data['vehicle_type_id'],
        discount: !!data['discount'] ? +data['discount'] : undefined,
        markup: !!data['markup'] ? +data['markup'] : undefined,
        isPercentage: +data['isPercentage'],
        start_date: data['start_date'],
        expiry_date: !!data['expiry_date'] ? data['expiry_date'] : undefined
      }

      this.fleetService.createVehicleSpecialRate(reqData).subscribe({
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

      if(!data[idField]) {
        switch(idField) {
          case 'vehicle_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleIdMissing), this.notificationSoundPipe.transform());
            break;
          case 'vehicle_model_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleModelIdMissing), this.notificationSoundPipe.transform());
            break;
          case 'vehicle_category_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleCategoryIdMissing), this.notificationSoundPipe.transform());
            break;
          case 'vehicle_type_id':
            this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateVehicleTypeIdMissing), this.notificationSoundPipe.transform());
            break;
        }
        return;
      }

      if(!!data["discount"] && !!data["markup"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateConflictingOffer), this.notificationSoundPipe.transform());
        return;
      }

      if(!data["start_date"]) {
        this.notificationService.renderTemplate(NotificationType.Warning, this.translationPipe.transform(NotificationPhrases.VehicleSpecialRateStartDateMissing), this.notificationSoundPipe.transform());
        return;
      }
      
      const date = new Date(data["start_date"]);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      data["start_date"] = `${day}/${month}/${year}`;

      if(!!data["expiry_date"]) {
        const expiryDate = new Date(data["expiry_date"]);
        const expiryDay = String(expiryDate.getDate()).padStart(2, '0');
        const expiryMonth = String(expiryDate.getMonth() + 1).padStart(2, '0');
        const expiryYear = expiryDate.getFullYear();
        data["expiry_date"] = `${expiryDay}/${expiryMonth}/${expiryYear}`;
      }

      if(!data['isPercentage'])
        data['isPercentage'] = 0;
      else
        data['isPercentage'] = !!data['isPercentage'] ? 1 : 0;

        const reqData: VehicleSpecialRate = {
          id: +data['id'],
          vehicle_id: +data['vehicle_id'],
          vehicle_model_id: +data['vehicle_model_id'],
          vehicle_category_id: +data['vehicle_category_id'],
          vehicle_type_id: +data['vehicle_type_id'],
          discount: !!data['discount'] ? +data['discount'] : undefined,
          markup: !!data['markup'] ? +data['markup'] : undefined,
          isPercentage: +data['isPercentage'],
          start_date: data['start_date'],
          expiry_date: !!data['expiry_date'] ? data['expiry_date'] : undefined
        }

      this.fleetService.updateVehicleSpecialRate(reqData).subscribe({
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

      this.fleetService.deleteVehicleSpecialRate(data['id']).subscribe({
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
    
    const fetchDataValues: FetchDataTableValues = {
      VehicleSpecialRates: {},
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
  }

  saveAction(): void {
    this.gridService.updateData();
  }

  parseDate(date: string): string {
    const convertedDate = date.split("/");
    return `${convertedDate[2]}/${convertedDate[1]}/${convertedDate[0]}`;
  }
}
