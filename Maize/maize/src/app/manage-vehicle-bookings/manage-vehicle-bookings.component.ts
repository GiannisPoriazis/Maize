import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { ColDef, RowDoubleClickedEvent } from 'ag-grid-community';

import { GridComponent } from '../grid/grid.component';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/services/notification.service';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { CommonModule } from '@angular/common';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { VehicleBooking } from 'src/interfaces/vehicle.booking.interface';
import { VehicleBookingComponent } from '../vehicle-booking/vehicle-booking.component';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { VehicleModel } from 'src/interfaces/vehicle.model.interface';
import { Vehicle } from 'src/interfaces/vehicle.interface';
import { CarRentalStation } from 'src/interfaces/carRental.station.interface';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-manage-vehicle-bookings',
  templateUrl: './manage-vehicle-bookings.component.html',
  styleUrls: ['./manage-vehicle-bookings.component.scss'],
  providers: [
    TranslationPipe
  ],
  imports: [
    GridComponent,
    FormsModule,
    CommonModule,
    VehicleBookingComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ]
})
export class ManageVehicleBookingsComponent implements OnInit {
  selectedEntity?: VehicleBooking;
  rowData: any = [];
  colDefs: ColDef[] = [
    { field: "id", hide: true },
    { field: "billing_name", headerName: 'Customer Name' },
    { field: "billing_tax", headerName: 'Tax Number' },
    { field: "date_from", headerName: 'Check-out Date' },
    { field: "date_to", headerName: 'Check-in Date' },
    { field: "checkout", headerName: 'Check-out Station' },
    { field: "checkin", headerName: 'Check-in Station' },
    { field: "vehicle_id", headerName: 'Vehicle Model' },
    { field: "total_price", headerName: 'Total' }
  ];

  private foundEntities?: VehicleBooking[] = [];
  
  private fetchDataKeys: string[] = ['Vehicle', 'VehicleModel', 'CarRentalStation', 'Client', 'VehicleBooking'];
  public dataTable: BehaviorSubject<DataTable>;

  constructor(
    private fleetService: CarRentalFleetService, 
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe,
    private appService: AppService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    const fetchDataValues: FetchDataTableValues = {
      VehicleBooking: {},
      Vehicle: {},
      VehicleModel: {},
      CarRentalStation: {},
      Client: {},
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
  }

  onSubmit(form: NgForm): void {
    this.fleetService.findBookings(form.value.SearchEntity).subscribe({
      next: (res: VehicleBooking[]) => {
        this.foundEntities = res;
        this.rowData = [];

        res.forEach((booking) => {
          this.rowData.push({
            id: booking.id,
            vehicle_id: this.dataTable.getValue().VehicleModel.find(x => x.id === this.dataTable.getValue().Vehicle.find(x => x.id === booking.vehicle_id)!.model_id)!.description,
            date_from: booking.date_from,
            date_to: booking.date_to,
            checkout: this.dataTable.getValue().CarRentalStation.find(x => x.id === booking.checkout)?.station_name,
            checkin: this.dataTable.getValue().CarRentalStation.find(x => x.id === booking.checkin)?.station_name,
            total_price: booking.total_price,
            billing_name: booking.billing_name,
            billing_tax: booking.billing_tax
          });
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.rowData = [];
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.SearchBookingNotFound), this.notificationSoundPipe.transform());
        }
        else {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      }
    });
  }

  selectEntity(params: RowDoubleClickedEvent) {
    const entity = this.foundEntities?.find(u => u.id === params.data.id);
    this.selectedEntity = entity;
  }

  stopEdit() {
    this.foundEntities = [];
    this.rowData = [];
    this.selectedEntity = undefined;
  }
}

