import { Component, signal } from '@angular/core';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { DataTable, AppService } from 'src/services/app.service';
import { CarRentalStation } from 'src/interfaces/carRental.station.interface';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Vehicle } from 'src/interfaces/vehicle.interface';
import { HelperService } from 'src/services/helper.service';
import { GetVehicleSpecialRates_Request } from 'src/interfaces/vehicle.special.rate.interface';
import { CarRentalBookingEngineService } from 'src/services/carRental.booking.engine.service';
import { DataViewModule } from 'primeng/dataview';
import { VehicleModel } from 'src/interfaces/vehicle.model.interface';
import { TranslationPipe } from 'src/pipes/translation.pipe';

export interface ExtendedVehicle extends Vehicle {
  model_description?: string;
}

@Component({
  selector: 'app-car-rental-booking-engine',
  standalone: true,
  templateUrl: './car-rental-booking-engine.component.html',
  styleUrl: './car-rental-booking-engine.component.scss',
  providers: [
    TranslationPipe
  ],
  imports: [
    DatepickerComponent,
    NgbTimepickerModule,
    CommonModule,
    ReactiveFormsModule,
    DataViewModule,
    TranslationPipe
  ]
})
export class CarRentalBookingEngineComponent {
  private fetchDataKeys: string[] = ['CRBE_Stations', 'CRBE_Vehicles', 'CRBE_VehicleBookings', 'CRBE_VehicleModels'];
  public dataTable: BehaviorSubject<DataTable>;

  bookingForm!: FormGroup;
  stations: CarRentalStation[] = [];
  vehicles = signal<ExtendedVehicle[]>([]);
  vehicleModels: VehicleModel[] = [];
  bookingDays: number = 0;

  constructor(
    public appService: AppService,
    private helperService: HelperService,
    private carRentalBookingEngineService: CarRentalBookingEngineService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.appService.fetchData(this.dataTable, this.fetchDataKeys);
    this.setSubscriptions();   
    this.initForm();
  }

  initForm() {
    this.bookingForm = new FormGroup({
      'billing_type': new FormControl('0'),
      'client_type': new FormControl('0'),
      'client_id': new FormControl(null),
      'vehicle_id': new FormControl(null, Validators.required),
      'date_from': new FormControl(null, Validators.required),
      'date_to': new FormControl(null, Validators.required),
      'checkout': new FormControl(null, Validators.required),
      'checkin': new FormControl(null, Validators.required),
      'total_price': new FormControl(0, Validators.required),
      'first_name': new FormControl(null, Validators.required),
      'last_name': new FormControl(null, Validators.required),
      'email': new FormControl(null, Validators.required),
      'taxId': new FormControl(null),
      'mobile_phone': new FormControl(null),
      'birth_date': new FormControl(null),
      'company_name': new FormControl(null),
      'tax_number': new FormControl(null),
      'billing_country': new FormControl(null),
    });
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().CRBE_Stations.length) {   
        this.stations = this.dataTable.getValue().CRBE_Stations; 
      }
    });
  }

  calculateDates(): void {
    if(!!this.bookingForm.value.date_from && !!this.bookingForm.value.date_to) {
      const dateFrom = new Date(this.bookingForm.value.date_from['year'], this.bookingForm.value.date_from['month'] - 1, this.bookingForm.value.date_from['day']);
      const dateTo = new Date(this.bookingForm.value.date_to['year'], this.bookingForm.value.date_to['month'] - 1, this.bookingForm.value.date_to['day']);;
      
      this.bookingDays = Math.ceil(Math.abs(dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24));
      this.findVehicles(dateFrom, dateTo);
    }
  }

  findVehicles(date_from: Date, date_to: Date): void {
      this.bookingForm.controls['vehicle_id'].setValue(null);
      let availableVehicles : Vehicle[] = [];
  
      this.dataTable.getValue().CRBE_Vehicles
        .filter(vehicle => vehicle.state === this.appService.VehicleStates.ready_to_go_status)
        .forEach((vehicle) => {
          if(this.dataTable.getValue().CRBE_VehicleBookings.find(booking => 
            booking.vehicle_id === vehicle.id && 
            this.helperService.overlappingDates(date_from, date_to, this.helperService.convertStringToDate(booking.date_from!), this.helperService.convertStringToDate(booking.date_to!)) 
          ))
            return;
  
          availableVehicles.push(vehicle);
      });
  
      const req: GetVehicleSpecialRates_Request = {
        bookingDate: `${date_from.getDate().toString().padStart(2, '0')}/${(date_from.getMonth() + 1).toString().padStart(2, '0')}/${date_from.getFullYear()}`,
        vehicles: availableVehicles
      }
  
      this.carRentalBookingEngineService.getAvailableVehicleSpecialRates(req).subscribe({
        next: (res: Vehicle[]) => {
          let extendedVehicles: ExtendedVehicle[] = [];

          res.forEach(vehicle => {
            extendedVehicles.push({
              ...vehicle,
              model_description: this.dataTable.getValue().CRBE_VehicleModels?.find(model => model.id === vehicle.model_id)?.description
            });
          });

          this.vehicles.set(extendedVehicles);
        }
      }); 
    }
}
