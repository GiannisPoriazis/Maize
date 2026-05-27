import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class HelperService {
  overlappingDate(date: Date, startDate: Date, endDate: Date): boolean {
    return date >= startDate && date <= endDate;
  }

  overlappingDates(dateFrom: Date, dateTo: Date, startDate: Date, endDate: Date): boolean {
    return this.overlappingDate(dateFrom, startDate, endDate) || this.overlappingDate(dateTo, startDate, endDate) || dateFrom <= startDate && dateTo >= endDate;
  }

  convertStringToDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  getLastDayOfMonth(year: number, month: number): number {
    let date = new Date(year, month, 0); 
    return date.getDate(); 
  }
}