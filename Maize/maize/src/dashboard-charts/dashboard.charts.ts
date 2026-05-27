import { ChartData } from 'chart.js';
import { carRentalRevenueLineChartOptions, clientsLineChartOptions, vehicleBookingsBarChartOptions, vehicleBookingsLineChartOptions } from './car.rental.charts';

export class DashboardCharts {
    public vehicleBookingsBarChartOptions = vehicleBookingsBarChartOptions;
    public vehicleBookingsLineChartOptions = vehicleBookingsLineChartOptions;
    public carRentalRevenueLineChartOptions = carRentalRevenueLineChartOptions;
    public clientsLineChartOptions = clientsLineChartOptions;

    public vehicleBookingsBarChartData?: ChartData<'bar'>;
    public vehicleBookingsLineChartData?: ChartData<'line'>;
    public carRentalRevenueLineChartData?: ChartData<'line'>;
    public clientsLineChartData?: ChartData<'line'>;
    
    public vehicleBookingsLinePercentage?: string;
    public carRentalRevenueLinePercentage?: string;
    public clientsLinePercentage?: string;
}