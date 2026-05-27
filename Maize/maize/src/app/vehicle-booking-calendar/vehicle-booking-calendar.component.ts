import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DatesSetArg, EventClickArg, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import { TranslationPipe } from "../../pipes/translation.pipe";
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { VehicleBooking } from 'src/interfaces/vehicle.booking.interface';
import { VehicleBookingEvent, ModalComponent } from '../modal/modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalType } from 'src/refData/ref-data';
import { HelperService } from 'src/services/helper.service';
import { BehaviorSubject } from 'rxjs';

moment.locale('en');

@Component({
  selector: 'app-vehicle-booking-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    BackgroundThemeDirective,
    TranslationPipe
  ],
  templateUrl: './vehicle-booking-calendar.component.html',
  styleUrl: './vehicle-booking-calendar.component.css'
})
export class VehicleBookingCalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  private fetchDataKeys: string[] = ['Vehicle', 'VehicleModel', 'CarRentalStation', 'Client', 'VehicleBooking'];
  public dataTable: BehaviorSubject<DataTable>;
  
  calendarOptions?: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    eventClick: (arg) => this.handleEventClick(arg),
    datesSet: (arg) => this.updateCalendar(arg),
  };

  eventDetails?: {
    modalTitle: string,
    modalBody: string
  } = {
    modalTitle: '',
    modalBody: ''
  }

  updateCalendarFlag: boolean = false;

  constructor(
    private appService: AppService,
    private modalService: NgbModal,
    private helperService: HelperService
  ) {
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  ngAfterViewInit(): void {
    const date: Date = this.calendarComponent.getApi().getDate();
    this.updateCalendarFlag = true;
    this.setCalendarDateFilters(date);
  }

  setCalendarDateFilters(date: Date) {
    const fetchDataValues: FetchDataTableValues = {
      VehicleBooking: {
        date_from: `01/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
        date_to: `${this.helperService.getLastDayOfMonth(date.getFullYear(), date.getMonth() + 1)}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
      },
      Vehicle: {},
      VehicleModel: {},
      CarRentalStation: {},
      Client: {},
    }

    this.appService.fetchData(this.dataTable, this.fetchDataKeys, fetchDataValues);
  }

  setSubscriptions(): void {
    this.dataTable.subscribe(() => {

      if(!!this.dataTable.getValue().VehicleBooking.length && !!this.dataTable.getValue().Client.length && this.updateCalendarFlag) {  
        this.updateCalendarFlag = false;        
        const bookings: VehicleBooking[] = this.dataTable.getValue().VehicleBooking;
        let events: EventInput[] = [];

        bookings.forEach((booking) => {
          const client = this.dataTable.getValue().Client?.find(x => x.id === booking.client_id);

          const [day_from, month_from, year_from] = booking.date_from!.split('/');
          const dateFrom = new Date(Number(year_from), Number(month_from) - 1, Number(day_from));

          const [day_to, month_to, year_to] = booking.date_to!.split('/');
          const dateTo = new Date(Number(year_to), Number(month_to) - 1, Number(day_to));

          events.push({
            title: `${client!.first_name} ${client!.last_name}`,
            start: dateFrom,
            end: dateTo,
            id: booking?.id.toString()
          })
        });

        this.setCalendarEvents(events);
      }
    });
  }

  updateCalendar(arg: DatesSetArg) {
    arg.view.calendar.removeAllEvents();
    const date: Date = this.calendarComponent.getApi().getDate();

    if(!!this.dataTable.getValue().VehicleBooking)
      this.dataTable.getValue().VehicleBooking.splice(0, this.dataTable.getValue().VehicleBooking.length);

    this.updateCalendarFlag = true; 
    this.setCalendarDateFilters(date);
  }

  setCalendarEvents(events: EventInput[]) {
    if(!!this.calendarOptions)
      this.calendarOptions.events = events;
  }

  handleEventClick(arg: EventClickArg): void {
    const booking = this.dataTable.getValue().VehicleBooking?.find(x => x.id === +arg.event.id);
    const vehicle = this.dataTable.getValue().Vehicle?.find(x => x.id === booking?.vehicle_id);
    this.eventDetails!.modalTitle = `#${booking?.id} - ${arg.event.title}`;

    if(!!arg.event.id)
      this.eventDetails!.modalBody = booking?.date_from!;

    const bookingEvent: VehicleBookingEvent = {
      CustomerName: booking?.billing_name,
      TaxNumber: booking?.billing_tax,
      Country: booking?.billing_country,
      VehicleMileage: vehicle?.mileage,
      VehicleModel: this.dataTable.getValue().VehicleModel?.find(x => x.id === vehicle?.model_id)?.description,
      VehicleRegistration: vehicle?.registration,
      DateFrom: booking?.date_from,
      DateTo: booking?.date_to,
      CheckOut: this.dataTable.getValue().CarRentalStation?.find(x => x.id === booking?.checkout)?.station_name,
      CheckIn: this.dataTable.getValue().CarRentalStation?.find(x => x.id === booking?.checkin)?.station_name,
      Price: booking?.total_price
    }

    const modalRef = this.modalService.open(ModalComponent); 
    modalRef.componentInstance.modalType = ModalType.VehicleBookingEvent;
    modalRef.componentInstance.modalTitle = this.eventDetails?.modalTitle;
    modalRef.componentInstance.modalBody = this.eventDetails?.modalBody; 
    modalRef.componentInstance.modalId = "EventDetailsModal";
    modalRef.componentInstance.confirmClass = "btn-primary";
    modalRef.componentInstance.confirmText = "Close";
    modalRef.componentInstance.centered = true;
    modalRef.componentInstance.staticBackdrop = true;
    modalRef.componentInstance.instanciated = true; 
    modalRef.componentInstance.vehicleBookingEvent = bookingEvent;
    modalRef.componentInstance.activeTab = 0;

    modalRef.componentInstance.cancelAction = () => {
      this.modalService.dismissAll();
    } 

    modalRef.componentInstance.confirmAction = () => {
      this.modalService.dismissAll();
    } 
  }
}
