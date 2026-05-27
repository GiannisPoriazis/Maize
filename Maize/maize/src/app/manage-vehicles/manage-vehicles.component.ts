import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { GridComponent } from '../grid/grid.component';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { ColDef, RowDoubleClickedEvent } from '@ag-grid-community/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationType, NotificationPhrases, VehicleStates } from 'src/refData/ref-data';
import { NotificationService } from 'src/services/notification.service';
import { Vehicle } from 'src/interfaces/vehicle.interface';
import { VehicleComponent } from '../vehicle/vehicle.component';
import { VehicleModel } from 'src/interfaces/vehicle.model.interface';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage-vehicles',
  standalone: true,
  templateUrl: './manage-vehicles.component.html',
  styleUrl: './manage-vehicles.component.scss',
  imports: [
    FormsModule,
    CommonModule,
    GridComponent,
    VehicleComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ],
  providers: [
    TranslationPipe
  ]
})
export class ManageVehiclesComponent {
  private foundVehicles?: Vehicle[] = [];
  public notification_sound?: number;

  private fetchDataKeys: string[] = ['VehicleModel'];
  public dataTable: BehaviorSubject<DataTable>;
  
  selectedVehicle?: Vehicle;
  rowData: any = [];
  colDefs: ColDef[] = [
    { field: "id", headerName: 'Vehicle ID' },
    { field: "registration", headerName: 'Registration' },
    { field: "model_id", headerName: 'Model' },
    { field: "vin", headerName: 'VIN' },
    { field: "state", headerName: 'State' }
  ];

  constructor(
    private fleetService: CarRentalFleetService, 
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe,
    private appService: AppService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit() {
    const fetchDataValues: FetchDataTableValues = {
      VehicleModel: {}
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
  }

  onSubmit(form: NgForm): void {
    this.fleetService.findVehicles(form.value.SearchVehicle).subscribe({
      next: (res: Vehicle[]) => {
        this.foundVehicles = res;
        this.rowData = [];

        res.forEach((vehicle) => {
          this.rowData.push({
            id: vehicle.id,
            registration: vehicle.registration,
            model_id: this.dataTable.getValue().VehicleModel.find(model => model.id === vehicle.model_id)?.description,
            vin: vehicle.vin,
            state: this.translationPipe.transform(VehicleStates.find(state => state.value === vehicle.state)?.key),
          })
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.rowData = [];
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.SearchVehicleNotFound), this.notificationSoundPipe.transform());
        }
        else {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      }
    });
  }

  selectVehicle(params: RowDoubleClickedEvent) {
    const vehicle = this.foundVehicles?.find(vehicle => vehicle.id === params.data.id);
    this.selectedVehicle = vehicle;
  }

  stopEdit() {
    this.foundVehicles = [];
    this.rowData = [];
    this.selectedVehicle = undefined;
  }
}
