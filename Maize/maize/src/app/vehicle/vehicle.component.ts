import { DatePipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { Vehicle, VehicleUpsert_Request } from 'src/interfaces/vehicle.interface';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { NotificationService } from 'src/services/notification.service';
import * as moment from 'moment';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationPhrases, NotificationType, VehicleGears, VehiclePoolTypes, VehicleStates } from 'src/refData/ref-data';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { ModalComponent } from '../modal/modal.component';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { BehaviorSubject } from 'rxjs';
import { CheckboxModule } from 'primeng/checkbox';
import { PickListModule } from 'primeng/picklist';
import { VehicleAddon } from 'src/interfaces/vehicle.addon.interface';
import { VehicleModel } from 'src/interfaces/vehicle.model.interface';
import { VehicleCategory } from 'src/interfaces/vehicle.category.interface';
import { VehicleType } from 'src/interfaces/vehicle.type.interface';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss',
  providers: [
    TranslationPipe,
    DatePipe
  ],
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    DatepickerComponent,
    ThemeDirective,
    BackgroundThemeDirective,
    CheckboxModule,
    PickListModule
  ]
})
export class VehicleComponent {
  @Input() vehicle?: Vehicle;
  @Output() backActionEvent = new EventEmitter();

  public vehicleForm!: FormGroup;
  public pageTitle?: string;

  private fetchDataKeys: string[] = [];
  public dataTable: BehaviorSubject<DataTable>;

  vehicleGears = VehicleGears;
  vehiclePoolTypes = VehiclePoolTypes;
  vehicleStates = VehicleStates;

  sourceAddons: VehicleAddon[] = [];
  selectedAddons: VehicleAddon[] = [];

  constructor(
    private fleetService: CarRentalFleetService,
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe, 
    private datePipe: DatePipe,
    private notificationSoundPipe: NotificationSoundPipe,
    private appService: AppService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit() {
    if(!this.vehicle)
      this.pageTitle = 'new_vehicle_page_title';
    else
      this.pageTitle = 'edit_vehicle_page_title';

    let fetchDataValues: FetchDataTableValues;

    if(!!this.vehicle) {
      this.fetchDataKeys = ['VehicleModel', 'VehicleCategory', 'VehicleType', 'VehicleAddons', 'VehicleAddonConnections'];

      fetchDataValues = {
        VehicleType: {},
        VehicleAddonConnections: this.vehicle.id
      }
    }
    else {
      this.fetchDataKeys = ['VehicleModel', 'VehicleCategory', 'VehicleType', 'VehicleAddons'];

      fetchDataValues = {
        VehicleType: {}
      }
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
    this.setSubscriptions();
    this.initForm();
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {

      if(!!this.dataTable.getValue().VehicleCategory.length && !!this.dataTable.getValue().VehicleType.length && !!this.dataTable.getValue().VehicleModel.length) {
        this.initFormValues();
      }

      if(!!this.dataTable.getValue().VehicleAddons?.length) {
        this.sourceAddons = this.dataTable.getValue().VehicleAddons!;
      }

      if(!!this.dataTable.getValue().VehicleAddonConnections?.length && !!this.dataTable.getValue().VehicleAddons?.length) {
        this.selectedAddons = this.dataTable.getValue().VehicleAddons!.filter(x => this.dataTable.getValue().VehicleAddonConnections?.map(connection => connection.addonId).includes(x.id));
        this.sourceAddons = this.sourceAddons.filter(x => !this.selectedAddons.includes(x));
      }
    });
  }

  initForm() {
    this.vehicleForm = new FormGroup({
      'registration': new FormControl(null, Validators.required),
      'model_id': new FormControl(null, Validators.required),
      'vin': new FormControl(null),
      'year': new FormControl(null, Validators.pattern(/^\d{4}$/)),
      'cc': new FormControl(0, Validators.pattern(/^\d+$/)),
      'color': new FormControl(null),
      'gears': new FormControl(0, Validators.required),
      'mileage': new FormControl(0, Validators.required),
      'insurance_company': new FormControl(null),
      'insurance_expiry': new FormControl(null),
      'daily_rate': new FormControl(null, Validators.required),
      'pool_type': new FormControl(0, Validators.required),
      'state': new FormControl(0, Validators.required),
      'vehicle_group': new FormControl({value: null, disabled: true}, Validators.required),
      'vehicle_type': new FormControl({value: null, disabled: true}, Validators.required),
      'passengers': new FormControl(null, [Validators.required, Validators.min(2), Validators.max(10)]),
      'air_condition': new FormControl(false, Validators.required),
      'doors': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(10)]),
      'radio': new FormControl(false, Validators.required),
      'gps': new FormControl(false, Validators.required),
      'touch_screen': new FormControl(false, Validators.required),
      'parking_camera': new FormControl(false, Validators.required),
      'usb': new FormControl(false, Validators.required),
      'bluetooth': new FormControl(false, Validators.required),
      'mirrorlink': new FormControl(false, Validators.required),
      'license_required': new FormControl(false, Validators.required),
      'driver_minimum_age': new FormControl(0, [Validators.required, Validators.min(0), Validators.max(99)])
    });
  }

  initFormValues(): void {
    if(!this.vehicle)
      return;

    let insurance_expiry: Date;

    if(this.vehicle.insurance_expiry)
      insurance_expiry = moment(this.vehicle.insurance_expiry, "DD/MM/YYYY").toDate();
    
    this.vehicleForm = new FormGroup({
      'registration': new FormControl(this.vehicle.registration, Validators.required),
      'model_id': new FormControl(this.vehicle.model_id, Validators.required),
      'vin': new FormControl(this.vehicle.vin),
      'year': new FormControl(this.vehicle.year, Validators.pattern(/^\d{4}$/)),
      'cc': new FormControl(this.vehicle.cc, Validators.pattern(/^\d+$/)),
      'color': new FormControl(this.vehicle.color),
      'gears': new FormControl(this.vehicle.gears, Validators.required),
      'mileage': new FormControl(this.vehicle.mileage, Validators.required),
      'insurance_company': new FormControl(this.vehicle.insurance_company),
      'insurance_expiry': new FormControl((this.vehicle.insurance_expiry) ? new NgbDate(insurance_expiry!.getFullYear(), insurance_expiry!.getMonth() + 1, insurance_expiry!.getDate()) : null),
      'daily_rate': new FormControl(this.vehicle.daily_rate?.toFixed(2), Validators.required),
      'pool_type': new FormControl(this.vehicle.pool_type, Validators.required),
      'state': new FormControl(this.vehicle.state, Validators.required),
      'vehicle_group': new FormControl({value: this.dataTable.getValue().VehicleCategory.find(category => category.id == this.dataTable.getValue().VehicleModel.find(model => model.id == this.vehicle?.model_id)?.vehicle_category_id)?.description, disabled: true}, Validators.required),
      'vehicle_type': new FormControl({value: this.dataTable.getValue().VehicleType.find(type => type.id == this.dataTable.getValue().VehicleCategory.find(category => category.id == this.dataTable.getValue().VehicleModel.find(model => model.id == this.vehicle?.model_id)?.vehicle_category_id)?.vehicle_type_id)?.description, disabled: true}, Validators.required),
      'passengers': new FormControl(this.vehicle.passengers, Validators.required),
      'doors': new FormControl(this.vehicle.doors, Validators.required),
      'air_condition': new FormControl(this.vehicle.air_condition ? true : false, Validators.required),
      'radio': new FormControl(this.vehicle.radio ? true : false, Validators.required),
      'gps': new FormControl(this.vehicle.gps ? true : false, Validators.required),
      'touch_screen': new FormControl(this.vehicle.touch_screen ? true : false, Validators.required),
      'parking_camera': new FormControl(this.vehicle.parking_camera ? true : false, Validators.required),
      'usb': new FormControl(this.vehicle.usb ? true : false, Validators.required),
      'bluetooth': new FormControl(this.vehicle.bluetooth ? true : false, Validators.required),
      'mirrorlink': new FormControl(this.vehicle.mirrorlink ? true : false, Validators.required),
      'license_required': new FormControl(this.vehicle.license_required ? true : false, Validators.required),
      'driver_minimum_age': new FormControl(this.vehicle.driver_minimum_age, [Validators.required, Validators.min(16), Validators.max(99)])
    });
  }

  updateVehicleGroupType(): void {
    const { model_id, vehicle_group, vehicle_type } = this.vehicleForm.controls;
    const vehicleModel: VehicleModel = this.dataTable.getValue().VehicleModel.find(x => x.id === model_id.value)!;
    const vehicleCategory: VehicleCategory = this.dataTable.getValue().VehicleCategory.find(x => x.id === vehicleModel.vehicle_category_id)!;
    const vehicleType: VehicleType = this.dataTable.getValue().VehicleType.find(x => x.id === vehicleCategory.vehicle_type_id)!;

    vehicle_group.setValue(vehicleCategory.description);
    vehicle_type.setValue(vehicleType.description)
  }

  onSubmit() {
    let date: Date;

    if(this.vehicleForm.value.insurance_expiry)
      date = new Date(this.vehicleForm.value.insurance_expiry['year'], this.vehicleForm.value.insurance_expiry['month'] - 1, this.vehicleForm.value.insurance_expiry['day']);

    const vehicle: Vehicle = {
      id: !this.vehicle ? 0 : this.vehicle.id,
      registration: this.vehicleForm.value.registration,
      model_id: this.vehicleForm.value.model_id,
      vin: this.vehicleForm.value.vin,
      year: this.vehicleForm.value.year,
      cc: this.vehicleForm.value.cc,
      color: this.vehicleForm.value.color,
      gears: this.vehicleForm.value.gears,
      mileage: this.vehicleForm.value.mileage,
      pool_type: this.vehicleForm.value.pool_type,
      state: this.vehicleForm.value.state,
      insurance_company: this.vehicleForm.value.insurance_company,
      insurance_expiry: (this.vehicleForm.value.insurance_expiry) ? this.datePipe.transform(date!, 'dd/MM/yyyy')!.toString() : undefined,
      daily_rate: this.vehicleForm.value.daily_rate.replace(',','.'),
      passengers: this.vehicleForm.value.passengers,
      doors: this.vehicleForm.value.doors,
      air_condition: !!this.vehicleForm.value.air_condition ? 1 : 0,
      radio: !!this.vehicleForm.value.radio ? 1 : 0,
      gps: !!this.vehicleForm.value.gps ? 1 : 0,
      touch_screen: !!this.vehicleForm.value.touch_screen ? 1 : 0,
      parking_camera: !!this.vehicleForm.value.parking_camera ? 1 : 0,
      usb: !!this.vehicleForm.value.usb ? 1 : 0,
      bluetooth: !!this.vehicleForm.value.bluetooth ? 1 : 0,
      mirrorlink: !!this.vehicleForm.value.mirrorlink ? 1 : 0,
      license_required: !!this.vehicleForm.value.license_required ? 1 : 0,
      driver_minimum_age: this.vehicleForm.value.driver_minimum_age
    }

    if(!this.vehicle) {
      this.createVehicle(vehicle);
      return;
    }

    this.updateVehicle(vehicle);
  }

  createVehicle(vehicle: Vehicle) {
    const req: VehicleUpsert_Request = {
      vehicle: vehicle,
      addonIds: this.selectedAddons.map(addon => addon.id)
    }

    this.fleetService.createVehicle(req).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.VehicleCreated), );
        this.vehicleForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  updateVehicle(vehicle: Vehicle) {
    const req: VehicleUpsert_Request = {
      vehicle: vehicle,
      addonIds: this.selectedAddons.map(addon => addon.id)
    }

    this.fleetService.updateVehicle(req).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.VehicleUpdated), );
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  deleteVehicle() {
    const vehicleId: number = this.vehicle!.id;

    this.fleetService.deleteVehicle(vehicleId).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.VehicleDeleted), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  backAction() {
    this.backActionEvent.emit();
    this.vehicle = undefined;
  }
}
