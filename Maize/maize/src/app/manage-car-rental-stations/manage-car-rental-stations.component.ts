import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { GridComponent } from '../grid/grid.component';
import { CarRentalStation } from 'src/interfaces/carRental.station.interface';
import { ColDef, RowDoubleClickedEvent } from '@ag-grid-community/core';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { NotificationService } from 'src/services/notification.service';
import { NotificationPhrases, NotificationType } from 'src/refData/ref-data';
import { HttpErrorResponse } from '@angular/common/http';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { CarRentalStationComponent } from '../car-rental-station/car-rental-station.component';

@Component({
  selector: 'app-manage-car-rental-stations',
  standalone: true,
  templateUrl: './manage-car-rental-stations.component.html',
  styleUrl: './manage-car-rental-stations.component.css',
  imports: [
    FormsModule,
    CommonModule,
    GridComponent,
    CarRentalStationComponent,
    ThemeDirective,
    BackgroundThemeDirective
  ],
  providers: [
    TranslationPipe
  ]
})
export class ManageCarRentalStationsComponent {
  private foundStations?: CarRentalStation[] = [];
  
  selectedItem?: CarRentalStation;
  rowData: any = [];
  colDefs: ColDef[] = [
    { field: "id", hide: true },
    { field: "station_name", headerName: 'Station' },
    { field: "station_address", headerName: 'Address' },
  ];

  constructor(
    private fleetService: CarRentalFleetService,
    private notificationService: NotificationService, 
    private translationPipe: TranslationPipe,
    private notificationSoundPipe: NotificationSoundPipe
  ) {}

  onSubmit(form: NgForm): void {
    this.fleetService.findStations(form.value.SearchItem).subscribe({
      next: (res: CarRentalStation[]) => {
        this.foundStations = res;
        this.rowData = [];

        res.forEach((station) => {
          this.rowData.push({
            id: station.id,
            station_name: station.station_name,
            station_address: station.station_address
          })
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.rowData = [];
          this.notificationService.renderTemplate(NotificationType.Info, this.translationPipe.transform(NotificationPhrases.SearchStationNotFound), this.notificationSoundPipe.transform());
        }
        else {
          this.notificationService.showError(error, this.notificationSoundPipe.transform());
        }
      }
    });
  }

  selectItem(params: RowDoubleClickedEvent) {
    const station = this.foundStations?.find(station => station.id === params.data.id);

    this.selectedItem = {
      id: station!.id,
      station_name: station!.station_name,
      station_address: station?.station_address
    }
  }

  stopEdit() {
    this.foundStations = [];
    this.rowData = [];
    this.selectedItem = undefined;
  }
}