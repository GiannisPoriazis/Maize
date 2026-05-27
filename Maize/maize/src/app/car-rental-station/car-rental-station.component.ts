import { DatePipe, CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { DatepickerComponent } from '../datepicker/datepicker.component';
import { ModalComponent } from '../modal/modal.component';
import { CarRentalStation } from 'src/interfaces/carRental.station.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { NotificationType, NotificationPhrases } from 'src/refData/ref-data';
import { NotificationService } from 'src/services/notification.service';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { GooglePlacesDirective } from 'src/directives/google.places.directive';

@Component({
  selector: 'app-car-rental-station',
  standalone: true,
  templateUrl: './car-rental-station.component.html',
  styleUrl: './car-rental-station.component.scss',
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
    GooglePlacesDirective
  ]
})
export class CarRentalStationComponent {
  @Input() station?: CarRentalStation;
  @Output() backActionEvent = new EventEmitter();

  public stationForm!: FormGroup;
  public pageTitle?: string;

  constructor(
    private fleetService: CarRentalFleetService,
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe, 
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  ngOnInit() {
    if(!this.station)
      this.pageTitle = 'new_station_page_title';
    else
      this.pageTitle = 'edit_station_page_title';
  
    this.initForm();
  }

  onPlaceSelected(place: google.maps.places.PlaceResult) {
    console.log('Selected place:', place);
    this.stationForm.get('station_address')?.setValue(place.formatted_address);
  }

  initForm() {
    if(!this.station) {
      this.stationForm = new FormGroup({
        'station_name': new FormControl(null, Validators.required),
        'station_address': new FormControl(null, Validators.required)
      });

      return;
    }
    
    this.stationForm = new FormGroup({
      'station_name': new FormControl(this.station.station_name, Validators.required),
      'station_address': new FormControl(this.station.station_address, Validators.required)
    });
  }

  onSubmit() {
    const station: CarRentalStation = {
      id: !this.station ? 0 : this.station.id,
      station_name: this.stationForm.value.station_name,
      station_address: this.stationForm.value.station_address,
    }

    if(!this.station) {
      this.createStation(station);
      return;
    }

    this.updateStation(station);
  }

  createStation(station: CarRentalStation) {
    this.fleetService.createStation(station).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.CarRentalStationCreated), this.notificationSoundPipe.transform());
        this.stationForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  updateStation(station: CarRentalStation) {
    this.fleetService.updateStation(station).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.CarRentalStationUpdated), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  deleteStation() {
    const stationId: number = this.station!.id;

    this.fleetService.deleteStation(stationId).subscribe({
      next: () => {
        this.notificationService.renderTemplate(NotificationType.Success, this.translationPipe.transform(NotificationPhrases.CarRentalStationDeleted), this.notificationSoundPipe.transform());
        this.backAction();
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  backAction() {
    this.backActionEvent.emit();
    this.station = undefined;
  }
}
