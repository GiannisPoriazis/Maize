import { ChartConfiguration } from "chart.js";

export const vehicleBookingsBarChartOptions: ChartConfiguration<'bar'>['options'] = {
    plugins: {
        legend: {
        display: false,
        }
    },
}; 

export const vehicleBookingsLineChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      x: {
        display: false 
      },
      y: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    },
}; 

export const carRentalRevenueLineChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    },
};

export const clientsLineChartOptions: ChartConfiguration<'line'>['options'] = {
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    },
};