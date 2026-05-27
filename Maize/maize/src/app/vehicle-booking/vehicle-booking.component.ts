import { DatePipe, CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ModalComponent } from '../modal/modal.component';
import { CarRental_CreateBooking_Request, VehicleBooking } from 'src/interfaces/vehicle.booking.interface';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { NotificationService } from 'src/services/notification.service';
import { NgbDateStruct, NgbTimepickerModule, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { countries, NotificationPhrases, NotificationType, VehicleStates } from 'src/refData/ref-data';
import { HttpErrorResponse } from '@angular/common/http';
import { GridComponent } from '../grid/grid.component';
import { ColDef } from '@ag-grid-community/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AutocompleteSelectService } from 'src/services/autocomplete.select.service';
import { Client } from 'src/interfaces/client.interface';
import { ClientService } from 'src/services/client.service';
import { MatSelectCountryLangToken, MatSelectCountryModule } from '@angular-material-extensions/select-country'; 
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { HelperService } from 'src/services/helper.service';
import { BehaviorSubject } from 'rxjs';
import { Vehicle } from 'src/interfaces/vehicle.interface';
import { GetVehicleSpecialRates_Request } from 'src/interfaces/vehicle.special.rate.interface';
import { GridService } from 'src/services/grid.service';
import { VehicleAddonConnection } from 'src/interfaces/vehicle.addon.connection.interface';
import { InputNumberModule } from 'primeng/inputnumber';

export interface ExtendedVehicleAddonConnection extends VehicleAddonConnection {
  title: string;
  max_quantity: number;
  rate: number;
}

@Component({
  selector: 'app-vehicle-booking',
  standalone: true,
  templateUrl: './vehicle-booking.component.html',
  styleUrl: './vehicle-booking.component.scss',
  providers: [
    TranslationPipe,
    DatePipe,
    { provide: MatSelectCountryLangToken, useValue: 'en' } // or another language code
  ],
  imports: [
    TranslationPipe,
    CommonModule,
    ReactiveFormsModule,
    ModalComponent,
    DatepickerComponent,
    ThemeDirective,
    BackgroundThemeDirective,
    GridComponent,
    AutoCompleteModule,
    MatSelectCountryModule,
    NgbTimepickerModule,
    InputNumberModule
  ]
})
export class VehicleBookingComponent implements OnInit, AfterViewInit {
  @Input() booking?: VehicleBooking;
  @Output() backActionEvent = new EventEmitter();
  @ViewChild('TotalPrice') totalPrice!: ElementRef;
  @ViewChild('rate') rate!: ElementRef;
  @ViewChild('days') days!: ElementRef;
  @ViewChild('preTotal') preTotal!: ElementRef;
  @ViewChild('addonsTotal') addonsTotal!: ElementRef;

  public bookingForm!: FormGroup;
  public pageTitle?: string;

  public dataTable: BehaviorSubject<DataTable>;

  vehicleRowData: any = [];
  vehicleColDefs: ColDef[] = [
    { field: "id", hide: true },
    { field: "registration", headerName: 'Registration' },
    { field: "model_id", headerName: 'Model' },
    { field: "vin", headerName: 'VIN' },
    { field: "state", headerName: 'State' },
    { field: "rate", headerName: 'Rate'}
  ];

  clientRowData: any = [];
  clientColDefs: ColDef[] = [
    { field: "id", hide: true },
    { field: "first_name", headerName: 'First name' },
    { field: "last_name", headerName: 'Last name' },
    { field: "email", headerName: 'E-mail' },
    { field: "mobile_phone", headerName: 'Mobile Phone' },
    { field: "taxId", headerName: 'Tax Id' },
    { field: "birth_date", headerName: 'Date of Birth' }
  ];

  public countries: any = countries;
  public vehicleAddonConnections: ExtendedVehicleAddonConnection[] = []; 

  constructor(
    private appService: AppService,
    private helperService: HelperService,
    private fleetService: CarRentalFleetService,
    private clientService: ClientService,
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe, 
    private datePipe: DatePipe,
    private notificationSoundPipe: NotificationSoundPipe,
    public autocompleteSelectService: AutocompleteSelectService,
    private gridService: GridService,
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit() {
    if(!this.booking)
      this.pageTitle = 'new_booking_page_title';
    else
      this.pageTitle = 'edit_booking_page_title';

    this.initForm();
  }

  ngAfterViewInit() {
    const fetchDataValues: FetchDataTableValues = {
      VehicleBooking: {},
      Vehicle: {},
      VehicleModel: {},
      CarRentalStation: {},
      Client: {},
    }

    const fetchDataKeys: string[] = ['Vehicle', 'VehicleModel', 'CarRentalStation', 'Client', 'VehicleBooking', 'VehicleAddons'];

    this.appService.fetchData(this.dataTable, fetchDataKeys, fetchDataValues);
    this.setSubscriptions();
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      if(!!this.dataTable.getValue().Client.length && !!this.dataTable.getValue().Vehicle.length && !this.dataTable.getValue().VehicleAddonConnections) {
        this.clientRowData = [];      
        const clients: Client[] = this.dataTable.getValue().Client;

        if(this.booking) 
          this.clientRowData.push(clients.find(x => x.id === this.booking?.client_id));
        else { 
          clients.forEach((client) => {
            this.clientRowData.push({
              id: client.id,
              first_name: client.first_name,
              last_name: client.last_name,
              email: client.email,
              mobile_phone: client.mobile_phone,
              birth_date: client.birth_date,
              taxId: client.taxId
            });
          });
        }

        this.initFormValues();
      }

      if(!!this.dataTable.getValue().VehicleAddonConnections?.length) {
        this.vehicleAddonConnections = [];

        this.dataTable.getValue().VehicleAddonConnections!.forEach(addon => {
          const vehicleAddon = this.dataTable.getValue().VehicleAddons?.find(x => x.id === addon.addonId);
          this.vehicleAddonConnections.push({
            ...addon,
            title: vehicleAddon!.title,
            max_quantity: vehicleAddon!.max_quantity,
            rate: vehicleAddon!.rate
          });

          const controlName = `addon${addon.addonId}`;
          if(!this.bookingForm.contains(controlName))
            this.bookingForm.addControl(
              controlName, new FormControl(0, [Validators.min(0), Validators.max(vehicleAddon!.max_quantity)])
            );
        });
      }
      else {
        this.vehicleAddonConnections = [];
      }
    });
  }

  initForm() {
    this.bookingForm = new FormGroup({
      'billing_type': new FormControl('0'),
      'client_type': new FormControl('0'),
      'client_id': new FormControl(null),
      'vehicle_id': new FormControl(null, Validators.required),
      'date_from': new FormControl(null, Validators.required),
      'date_to': new FormControl(null, Validators.required),
      'time_from': new FormControl(null, Validators.required),
      'time_to': new FormControl(null, Validators.required),
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
      'discount': new FormControl(0, [Validators.min(0), Validators.max(100)]),
      'vat': new FormControl(0, [Validators.min(0), Validators.max(100)])
    });
  }

  initFormValues(): void {
    if(!this.booking)
      return;

    const client: Client = this.dataTable.getValue().Client.find(client => client.id === this.booking?.client_id)!;

    const booking_date_from = this.booking.date_from!.split('/');
    const date_from: NgbDateStruct = {
      day: +booking_date_from[0],
      month: +booking_date_from[1],
      year: +booking_date_from[2]
    }

    const booking_date_to = this.booking.date_to!.split('/');
    const date_to: NgbDateStruct = {
      day: +booking_date_to[0],
      month: +booking_date_to[1],
      year: +booking_date_to[2]
    }

    const booking_time_from = this.booking.time_from!.split(':');
    const time_from: NgbTimeStruct = {
      hour: +booking_time_from[0],
      minute: +booking_time_from[1],
      second: 0
    }

    const booking_time_to = this.booking.time_to!.split(':');
    const time_to: NgbTimeStruct = {
      hour: +booking_time_to[0],
      minute: +booking_time_to[1],
      second: 0
    }

    this.bookingForm = new FormGroup({
      'billing_type': new FormControl({ value: this.booking.billing_type.toString(), disabled: true }),
      'client_type': new FormControl({ value: '1', disabled: true }),
      'client_id': new FormControl(this.booking.client_id),
      'vehicle_id': new FormControl({ value: this.booking.vehicle_id, disabled: true }),
      'date_from': new FormControl({ value: date_from, disabled: true }),
      'date_to': new FormControl({ value: date_to, disabled: true }),
      'time_from': new FormControl({ value: time_from, disabled: true }),
      'time_to': new FormControl({ value: time_to, disabled: true }),
      'checkout': new FormControl({ value: this.dataTable.getValue().CarRentalStation.find(x => x.id === this.booking?.checkout), disabled: true }),
      'checkin': new FormControl({ value: this.dataTable.getValue().CarRentalStation.find(x => x.id === this.booking?.checkin), disabled: true }),
      'total_price': new FormControl(this.booking.total_price),
      'first_name': new FormControl({ value: client.first_name, disabled: true }),
      'last_name': new FormControl({ value: client.last_name, disabled: true }),
      'email': new FormControl({ value: client.email, disabled: true }),
      'taxId': new FormControl({ value: client.taxId, disabled: true }),
      'mobile_phone': new FormControl({ value: client.mobile_phone, disabled: true }),
      'birth_date': new FormControl({ value: client.birth_date, disabled: true }),
      'company_name': new FormControl({ value: this.booking.billing_name, disabled: true }),
      'tax_number': new FormControl({ value: this.booking.billing_tax, disabled: true }),
      'billing_country': new FormControl({ value: this.booking.billing_country, disabled: true }),
      'discount': new FormControl({ value: this.booking.discount, disabled: true }),
      'vat': new FormControl({ value: this.booking.vat, disabled: true })
    });

    const vehicle = this.dataTable.getValue().Vehicle.find(x => x.id === this.booking?.vehicle_id)!;

    this.vehicleRowData = [{
      id: vehicle.id,
      registration: vehicle.registration,
      model_id: this.dataTable.getValue().VehicleModel?.find(model => model.id === vehicle.model_id)?.description,
      vin: vehicle.vin,
      state: this.translationPipe.transform('ready_to_go_status'),
      rate: vehicle.daily_rate
    }];
    
    this.gridService.refreshData();

    this.totalPrice.nativeElement.innerText = `${this.booking.total_price} €`;
  }

  selectVehicle(params: any) {
    this.bookingForm.controls["vehicle_id"].setValue(params.data.id);
    this.rate.nativeElement.innerText = params.data.rate;

    if(!!this.bookingForm.value.date_from && !!this.bookingForm.value.date_to)
      this.calculatePreTotal();

    const fetchDataValues: FetchDataTableValues = {
      VehicleBooking: {},
      Vehicle: {},
      VehicleModel: {},
      CarRentalStation: {},
      Client: {},
      VehicleAddonConnections: +params.data.id
    }

    const fetchDataKeys: string[] = ['Vehicle', 'VehicleModel', 'CarRentalStation', 'Client', 'VehicleBooking', 'VehicleAddons', 'VehicleAddonConnections'];

    this.appService.fetchData(this.dataTable, fetchDataKeys, fetchDataValues);
  }

  selectClient(params: any) {
    let client: Client = this.dataTable.getValue().Client.find(client => client.id === params.data.id)!;
    this.bookingForm.controls["client_id"].setValue(client.id);

    this.bookingForm.controls['first_name'].setValue(client.first_name);
    this.bookingForm.controls['last_name'].setValue(client.last_name);
    this.bookingForm.controls['email'].setValue(client.email);
    this.bookingForm.controls['taxId'].setValue(client.taxId);
    this.bookingForm.controls['mobile_phone'].setValue(client.mobile_phone);
    this.bookingForm.controls['birth_date'].setValue(client.birth_date);
  }

  onSubmit() {
    if(this.bookingForm.value.client_type == 0) {
      this.createClient();
    }
    else {
      this.prepareBooking(this.bookingForm.value.client_id);
    }
  }

  clientUpdate() {
    if(this.bookingForm.value.client_type == 0) {
      this.bookingForm.get('first_name')?.reset();
      this.bookingForm.get('last_name')?.reset();
      this.bookingForm.get('email')?.reset();
      this.bookingForm.get('taxId')?.reset();
      this.bookingForm.get('mobile_phone')?.reset();
      this.bookingForm.get('birth_date')?.reset();
    }
  }

  createClient() {
    const client: Client = {
      id: 0,
      first_name: this.bookingForm.value.first_name,
      last_name: this.bookingForm.value.last_name,
      email: this.bookingForm.value.email,
      taxId: this.bookingForm.value.taxId,
      mobile_phone: this.bookingForm.value.mobile_phone,
      birth_date: this.bookingForm.value.birth_date
    }

    this.clientService.createClient(client).subscribe({
      next: (client_id: number) => {
        this.prepareBooking(client_id);
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  prepareBooking(client_id: number) {
    let date_from: Date;
    let date_to: Date;
    let time_from: string = "";
    let time_to: string = "";
    let billing_name: string;
    let billing_tax: string;

    if(this.bookingForm.value.date_from)
      date_from = new Date(this.bookingForm.value.date_from['year'], this.bookingForm.value.date_from['month'] - 1, this.bookingForm.value.date_from['day']);

    if(this.bookingForm.value.date_to)
      date_to = new Date(this.bookingForm.value.date_to['year'], this.bookingForm.value.date_to['month'] - 1, this.bookingForm.value.date_to['day']);

    if(this.bookingForm.value.time_from)
      time_from = `${this.bookingForm.value.time_from['hour'].toString().padStart(2, '0')}:${this.bookingForm.value.time_from['minute'].toString().padStart(2, '0')}`;
    
    if(this.bookingForm.value.time_to)
      time_to = `${this.bookingForm.value.time_to['hour'].toString().padStart(2, '0')}:${this.bookingForm.value.time_to['minute'].toString().padStart(2, '0')}`;

    if(this.bookingForm.value.billing_type == 0) {
      billing_name = `${this.bookingForm.value.first_name} ${this.bookingForm.value.last_name}`;
      billing_tax = this.bookingForm.value.taxId;
    }
    else {
      billing_name = this.bookingForm.value.company_name;
      billing_tax = this.bookingForm.value.tax_number;
    }

    const booking: VehicleBooking = {
      id: 0,
      client_id: client_id,
      vehicle_id: this.bookingForm.value.vehicle_id,
      date_from: this.datePipe.transform(date_from!, 'dd/MM/yyyy')!,
      date_to: this.datePipe.transform(date_to!, 'dd/MM/yyyy')!,
      time_from: time_from,
      time_to: time_to,
      checkout: this.bookingForm.value.checkout.id,
      checkin: this.bookingForm.value.checkin.id,
      total_price: this.bookingForm.value.total_price,
      billing_type: this.bookingForm.value.billing_type,
      billing_name: billing_name,
      billing_tax: billing_tax,
      billing_country: this.bookingForm.value.billing_country,
      discount: this.bookingForm.value.discount,
      vat: this.bookingForm.value.vat
    }

    if(!this.booking) {
      this.createBooking(booking);
      return;
    }

    this.updateBooking(booking);
  }

  createBooking(booking: VehicleBooking) {
    const req: CarRental_CreateBooking_Request = {
      booking: booking,
      addons: []
    }

    this.vehicleAddonConnections.forEach(addon => {
      const control = this.bookingForm.controls[`addon${addon.addonId}`];

      if(control.valid) {
        req.addons.push({
          addon_id: addon.addonId,
          quantity: control.value
        });
      }
    });

    this.fleetService.createBooking(req).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.VehicleBookingCreated), this.notificationSoundPipe.transform());
        this.bookingForm.reset();
        this.rate.nativeElement.innerText = null;
        this.days.nativeElement.innerText = null;
        this.preTotal.nativeElement.innerText = null;
        this.totalPrice.nativeElement.innerText = null;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  updateBooking(booking: VehicleBooking) {
    this.fleetService.updateBooking(booking).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.VehicleBookingUpdated), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  deleteBooking() {
    const bookingId: number = this.booking!.id;

    this.fleetService.deleteBooking(bookingId).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.VehicleBookingDeleted), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  backAction() {
    this.backActionEvent.emit();
    this.booking = undefined;
  }

  calculatePrice(): void {
    if(!this.preTotal.nativeElement.innerText || !this.addonsTotal.nativeElement.innerText) 
      return;

    let price: number;

    const rate = +this.preTotal.nativeElement.innerText.split(' ')[0];
    const extras = +this.addonsTotal.nativeElement.innerText.split(' ')[0];

    price = rate! - (rate! * this.bookingForm.value.discount / 100);
    price += extras;
    price += price * this.bookingForm.value.vat / 100;

    this.bookingForm.get('total_price')?.setValue(price.toFixed(2));
    this.totalPrice.nativeElement.innerText = `${this.bookingForm.value.total_price} €`;
  }

  calculateDates(): void {
    if(!!this.bookingForm.value.date_from && !!this.bookingForm.value.date_to) {
      const dateFrom = new Date(this.bookingForm.value.date_from['year'], this.bookingForm.value.date_from['month'] - 1, this.bookingForm.value.date_from['day']);
      const dateTo = new Date(this.bookingForm.value.date_to['year'], this.bookingForm.value.date_to['month'] - 1, this.bookingForm.value.date_to['day']);;
      
      this.days.nativeElement.innerText = Math.ceil(Math.abs(dateTo.getTime() - dateFrom.getTime()) / (1000 * 60 * 60 * 24)).toString();
      this.findVehicles(dateFrom, dateTo);
    }
  }

  calculatePreTotal(): void {
    const days = +this.days.nativeElement.innerText;
    const rate = +this.rate.nativeElement.innerText;

    this.preTotal.nativeElement.innerText = `${(days*rate).toFixed(2)} €`;
    this.calculatePrice();
  }

  calculateAddons(): void {
    let total = 0;

    this.vehicleAddonConnections.forEach(addon => {
      const control = this.bookingForm.controls[`addon${addon.addonId}`];

      if(!control.valid && control.value > addon.max_quantity)
        total += addon.rate * addon.max_quantity;
      else if(!control.valid && control.value < 0)
        total += 0;
      else
        total += addon.rate * control.value;
    });

    this.addonsTotal.nativeElement.innerText = `${total.toFixed(2)} €`;
    this.calculatePrice();
  }

  findVehicles(date_from: Date, date_to: Date): void {
    this.bookingForm.controls['vehicle_id'].setValue(null);
    this.vehicleRowData = [];
    let availableVehicles : Vehicle[] = [];

    this.dataTable.getValue().Vehicle
      .filter(vehicle => vehicle.state === this.appService.VehicleStates.ready_to_go_status)
      .forEach((vehicle) => {
        if(this.dataTable.getValue().VehicleBooking.find(booking => 
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

    this.fleetService.getAvailableVehicleSpecialRates(req).subscribe({
      next: (res: Vehicle[]) => {
        this.vehicleRowData = res.map(vehicle => ({
          id: vehicle.id,
          registration: vehicle.registration,
          model_id: this.dataTable.getValue().VehicleModel?.find(model => model.id === vehicle.model_id)?.description,
          vin: vehicle.vin,
          state: this.translationPipe.transform('ready_to_go_status'),
          rate: vehicle.daily_rate
        }));
      }
    }); 
  }
}
