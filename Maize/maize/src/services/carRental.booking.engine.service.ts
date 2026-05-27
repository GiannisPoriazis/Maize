import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { CarRentalStation } from "src/interfaces/carRental.station.interface";
import { VehicleBooking, VehicleBooking_Request } from "src/interfaces/vehicle.booking.interface";
import { Vehicle, Vehicle_Request } from "src/interfaces/vehicle.interface";
import { VehicleModel, VehicleModel_Request } from "src/interfaces/vehicle.model.interface";
import { GetVehicleSpecialRates_Request } from "src/interfaces/vehicle.special.rate.interface";

@Injectable({
    providedIn: 'root'
})
  
export class CarRentalBookingEngineService {
    constructor(private http: HttpClient) {}

    hasBookingEngineModule() {
        return this.http.get<Boolean>(environment.apiURL + `carRental_bookingEngine/hasBookingEngineModule/`);
    }

    getStations() {
        return this.http.get<CarRentalStation[]>(environment.apiURL + `carRental_bookingEngine/getStations/`);
    }

    getVehicles(req: Vehicle_Request = {}) {
        return this.http.post<Vehicle[]>(environment.apiURL + `carRental_bookingEngine/getVehicles/`, req);
    }  

    getBookings(req: VehicleBooking_Request = {}) {
        return this.http.post<VehicleBooking[]>(environment.apiURL + `carRental_bookingEngine/getBookings/`, req);
    }

    getAvailableVehicleSpecialRates(req: GetVehicleSpecialRates_Request) {
        return this.http.post<Vehicle[]>(environment.apiURL + `carRental_bookingEngine/getAvailableVehicleSpecialRates/`, req);  
    }

    getVehicleModels(req: VehicleModel_Request = {}) {
        return this.http.post<VehicleModel[]>(environment.apiURL + `carRental_bookingEngine/getVehicleModels/`, req);
    }
}