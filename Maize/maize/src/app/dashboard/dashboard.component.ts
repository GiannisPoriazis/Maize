import { Component, OnInit } from '@angular/core';
import { BackgroundThemeDirective } from 'src/directives/theme.background.apply.directive';
import { ThemeDirective } from 'src/directives/theme.base.apply.directive';
import { ChartModule } from 'primeng/chart';
import { AppService, DataTable, FetchDataTableValues } from 'src/services/app.service';
import { HelperService } from 'src/services/helper.service';
import { ConfigurationService } from 'src/services/configuration.service';
import { CarRentalFleetService } from 'src/services/carRental.fleet.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationSoundPipe } from 'src/pipes/notification.sound.pipe';
import { NotificationService } from 'src/services/notification.service';
import { TranslationPipe } from 'src/pipes/translation.pipe';
import { LineChartData } from 'src/interfaces/line.chart.data.interface';
import { ClientService } from 'src/services/client.service';
import { CommonModule } from '@angular/common';
import { DashboardCharts } from 'src/dashboard-charts/dashboard.charts'; 
import { BehaviorSubject } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    ThemeDirective,
    BackgroundThemeDirective,
    ChartModule,
    TranslationPipe,
    CommonModule
  ]
})
export class DashboardComponent extends DashboardCharts implements OnInit {
  public companyType?: number;

  private fetchDataKeys?: string[];
  private fetchDataValues?: FetchDataTableValues;
  public dataTable: BehaviorSubject<DataTable>;

  constructor(
    private helperService: HelperService,
    public appService: AppService,
    private configurationService: ConfigurationService,
    private carRentalFleetService: CarRentalFleetService,
    private notificationSoundPipe: NotificationSoundPipe,
    private notificationService: NotificationService,
    private clientService: ClientService,
  ) {
    super();
    this.dataTable = this.appService.createDataTableInstance();
  }

  ngOnInit(): void {
    this.setSubscriptions();
  }

  private setSubscriptions(): void {
    this.dataTable.subscribe(() => {
      switch(this.companyType) {
        case this.appService.CompanyTypes.company_type_car_rental: 
          if(!!this.dataTable.getValue().VehicleBooking.length) {
            this.setCarRentalDashboard();
          }
          break;
      }
    });

    this.configurationService.adminSettings.subscribe((settings) => {
      if (settings) {
        this.companyType = +settings.company_type;
    
        switch (this.companyType) {
          case this.appService.CompanyTypes.company_type_car_rental:
            this.fetchDataKeys = ['VehicleBooking'];
    
            const currentDate = new Date();
            const adjustedDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 4);
            
            const adjustedMonth = adjustedDate.getMonth();
            const adjustedYear = adjustedDate.getFullYear();
    
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();
    
            this.fetchDataValues = {
              VehicleBooking: {
                date_from: `01/${adjustedMonth.toString().padStart(2, '0')}/${adjustedYear}`,
                date_to: `${this.helperService.getLastDayOfMonth(currentYear, currentMonth)}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`,
              },
            };
            break;
    
          default:
            this.fetchDataKeys = [];
            this.fetchDataValues = {};
        }

        this.appService.fetchData(this.dataTable, this.fetchDataKeys, this.fetchDataValues);
      }
    });
  }

  private setCarRentalDashboard(): void {
    this.setVehicleBookingsBarChart();
    this.setVehicleBookingsLineChart();
    this.setCarRentalRevenueLineChart();
    this.setClientLineChart();
  }

  private setVehicleBookingsBarChart() {
    let months: string[] = [];
    let bookings: number[] = [];
    let currentDate = new Date();
    
    for (let i = 0; i < 6; i++) {
      const monthLong = currentDate.toLocaleDateString('default', { month: 'long' });
      months.push(monthLong);
      bookings.push(this.dataTable.getValue().VehicleBooking.filter(booking => {
        const dateFrom = +booking.date_from!.split('/')[1];
        return dateFrom === currentDate.getMonth() + 1;
      }).length!);

      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    months.reverse();
    bookings.reverse();

    this.vehicleBookingsBarChartData = 
    {
      labels: months,
      datasets: [{
        data: bookings,
        backgroundColor: 'orange'
      }],
    };
  }

  private setVehicleBookingsLineChart(): void {
    this.carRentalFleetService.getBookingsLineChartData().subscribe({
      next: (res: LineChartData) => {
        let labels: string[] = [];
        let data: number[] = [];

        res.data.forEach((x) => {
          labels.push(x.key);
          data.push(x.value);
        });

        this.vehicleBookingsLineChartData = 
        {
          labels: labels,
          datasets: [{
            data: data,
            borderColor: data[0] > data[1] ? 'red' : 'green'
          }],
        };

        this.vehicleBookingsLinePercentage = `${data[0] > data[1] ? '' : '+'}${this.calculatePercentageChange(data[0], data[1]).toFixed(0)}`;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }
  
  private setCarRentalRevenueLineChart(): void {
    this.carRentalFleetService.getCarRentalRevenueLineChartData().subscribe({
      next: (res: LineChartData) => {
        let labels: string[] = [];
        let data: number[] = [];

        res.data.forEach((x) => {
          labels.push(x.key);
          data.push(x.value);
        });

        this.carRentalRevenueLineChartData = 
        {
          labels: labels,
          datasets: [{
            data: data,
            borderColor: data[0] > data[1] ? 'red' : 'green'
          }],
        };

        this.carRentalRevenueLinePercentage = `${data[0] > data[1] ? '' : '+'}${this.calculatePercentageChange(data[0], data[1]).toFixed(0)}`;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }
  
  private setClientLineChart(): void {
    this.clientService.getClientsLineChartData().subscribe({
      next: (res: LineChartData) => {
        let labels: string[] = [];
        let data: number[] = [];

        res.data.forEach((x) => {
          labels.push(x.key);
          data.push(x.value);
        });

        this.clientsLineChartData = 
        {
          labels: labels,
          datasets: [{
            data: data,
            borderColor: data[0] > data[1] ? 'red' : 'green'
          }],
        };

        this.clientsLinePercentage = `${data[0] > data[1] ? '' : '+'}${this.calculatePercentageChange(data[0], data[1]).toFixed(0)}`;
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.showError(error, this.notificationSoundPipe.transform());
      }
    });
  }

  calculatePercentageChange(oldValue: number, newValue: number): number {
    if (oldValue === 0) {
      return newValue === 0 ? 0 : 100; 
    }
    const change = ((newValue - oldValue) / oldValue) * 100;
    return change;
  }
}
