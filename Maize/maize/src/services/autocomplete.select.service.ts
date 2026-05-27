import { Injectable } from '@angular/core';
import { CarRentalStation } from 'src/interfaces/carRental.station.interface';
import { Countries } from 'src/interfaces/country.interface';

interface AutoCompleteCompleteEvent {
    originalEvent: Event;
    query: string;
}

@Injectable({
  providedIn: 'root'
})

export class AutocompleteSelectService {

    filteredStations: any[] = [];
    filteredCountries: any[] = [];

    constructor() {}

    filterStations(event: AutoCompleteCompleteEvent, stations: CarRentalStation[] | undefined) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (stations as CarRentalStation[]).length; i++) {
            let station = (stations as CarRentalStation[])[i];
            if (station.station_name.toLowerCase().indexOf(query.toLowerCase()) == 0 || station.station_address?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(station);
            }
        }

        this.filteredStations = filtered;
    }

    filterCountries(event: AutoCompleteCompleteEvent, countries: Countries[] | undefined) {
        let filtered: any[] = [];
        let query = event.query;

        for (let i = 0; i < (countries as Countries[]).length; i++) {
            let country = (countries as Countries[])[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }
}  