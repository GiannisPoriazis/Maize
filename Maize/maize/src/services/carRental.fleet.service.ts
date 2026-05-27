import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LineChartData } from "src/interfaces/line.chart.data.interface";
import { CarRentalStation, CarRentalStation_Request } from "src/interfaces/carRental.station.interface";
import { CarRental_CreateBooking_Request, VehicleBooking, VehicleBooking_Request } from "src/interfaces/vehicle.booking.interface";
import { VehicleCategory, VehicleCategory_Request } from "src/interfaces/vehicle.category.interface";
import { Vehicle, Vehicle_Request, VehicleUpsert_Request } from "src/interfaces/vehicle.interface";
import { VehicleModel, VehicleModel_Request } from "src/interfaces/vehicle.model.interface";
import { VehicleType, VehicleType_Request } from "src/interfaces/vehicle.type.interface";
import { GetVehicleSpecialRates_Request, VehicleSpecialRate, VehicleSpecialRate_Request } from "src/interfaces/vehicle.special.rate.interface";
import { VehicleAddon } from "src/interfaces/vehicle.addon.interface";
import { VehicleAddonConnection } from "src/interfaces/vehicle.addon.connection.interface";

@Injectable({
    providedIn: 'root'
})
  
export class CarRentalFleetService {
    constructor(private http: HttpClient) {}

    getVehicleTypes(req: VehicleType_Request = {}) {
        return this.http.post<VehicleType[]>(environment.apiURL + `carRental_vehicle/getVehicleTypes/`, req);
    }

    createVehicleType(type: VehicleType) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createVehicleType/`, type);
    }

    updateVehicleType(type: VehicleType) {
        return this.http.post(environment.apiURL + `carRental_vehicle/updateVehicleType/`, type);        
    }

    deleteVehicleType(typeId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteVehicleType/`, typeId);  
    }

    getVehicleCategories(req: VehicleCategory_Request = {}) {
        return this.http.post<VehicleCategory[]>(environment.apiURL + `carRental_vehicle/getVehicleCategories/`, req);
    }

    createVehicleCategory(category: VehicleCategory) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createVehicleCategory/`, category);
    }

    updateVehicleCategory(category: VehicleCategory) {
        return this.http.post(environment.apiURL + `carRental_vehicle/updateVehicleCategory/`, category);        
    }

    deleteVehicleCategory(categoryId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteVehicleCategory/`, categoryId);  
    }

    getVehicleModels(req: VehicleModel_Request = {}) {
        return this.http.post<VehicleModel[]>(environment.apiURL + `carRental_vehicle/getVehicleModels/`, req);
    }

    createVehicleModel(model: VehicleModel) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createVehicleModel/`, model);
    }

    updateVehicleModel(model: VehicleModel) {
        return this.http.post(environment.apiURL + `carRental_vehicle/updateVehicleModel/`, model);        
    }

    deleteVehicleModel(modelId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteVehicleModel/`, modelId);  
    }

    findVehicles(keyword?: string) {
        if(!keyword || keyword === '')
            return this.http.get<Vehicle[]>(environment.apiURL + `carRental_vehicle/findVehicles/all`);
        
        return this.http.get<Vehicle[]>(environment.apiURL + `carRental_vehicle/findVehicles/${keyword}`);
    }

    getVehicles(req: Vehicle_Request) {
        return this.http.post<Vehicle[]>(environment.apiURL + `carRental_vehicle/getVehicles/`, req);
    }

    createVehicle(req: VehicleUpsert_Request) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createVehicle/`, req);
    }

    updateVehicle(req: VehicleUpsert_Request) {
        return this.http.post(environment.apiURL + `carRental_vehicle/updateVehicle/`, req);        
    }

    deleteVehicle(vehicleId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteVehicle/`, vehicleId);  
    }

    createStation(station: CarRentalStation) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createStation/`, station);
    }

    updateStation(station: CarRentalStation) {
        return this.http.put(environment.apiURL + `carRental_vehicle/updateStation/`, station);        
    }

    deleteStation(stationId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteStation/`, stationId);  
    }

    getStations(req: CarRentalStation_Request) {
        return this.http.post<CarRentalStation[]>(environment.apiURL + `carRental_vehicle/getStations/`, req);
    }

    findStations(keyword?: string) {
        if(!keyword || keyword === '')
            return this.http.get<CarRentalStation[]>(environment.apiURL + `carRental_vehicle/findStations/*`);
        
        return this.http.get<CarRentalStation[]>(environment.apiURL + `carRental_vehicle/findStations/${keyword}`);
    }

    createBooking(booking_request: CarRental_CreateBooking_Request) {
        return this.http.post(environment.apiURL + `carRental_booking/createBooking/`, booking_request);
    }

    updateBooking(booking: VehicleBooking) {
        return this.http.put(environment.apiURL + `carRental_booking/updateBooking/`, booking);        
    }

    deleteBooking(bookingId: number) {
        return this.http.post(environment.apiURL + `carRental_booking/deleteBooking/`, bookingId);  
    }

    getBookings(req: VehicleBooking_Request) {
        return this.http.post<VehicleBooking[]>(environment.apiURL + `carRental_booking/getBookings/`, req);
    }

    findBookings(keyword?: string) {
        if(!keyword || keyword === '')
            return this.http.get<VehicleBooking[]>(environment.apiURL + `carRental_booking/findBookings/*`);
        
        return this.http.get<VehicleBooking[]>(environment.apiURL + `carRental_booking/findBookings/${keyword}`);
    }

    getBookingsLineChartData() {
        return this.http.get<LineChartData>(environment.apiURL + `carRental_booking/getBookingsLineChartData/`);
    }

    getCarRentalRevenueLineChartData() {
        return this.http.get<LineChartData>(environment.apiURL + `carRental_booking/getCarRentalRevenueLineChartData/`);
    }

    getVehicleSpecialRates(req: VehicleSpecialRate_Request) {
        return this.http.post<VehicleSpecialRate[]>(environment.apiURL + `carRental_vehicle/getVehicleSpecialRates/`, req);
    }

    createVehicleSpecialRate(rate: VehicleSpecialRate) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createVehicleSpecialRate/`, rate);
    }

    updateVehicleSpecialRate(rate: VehicleSpecialRate) {
        return this.http.post(environment.apiURL + `carRental_vehicle/updateVehicleSpecialRate/`, rate);        
    }

    deleteVehicleSpecialRate(rateId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteVehicleSpecialRate/`, rateId);  
    }

    getAvailableVehicleSpecialRates(req: GetVehicleSpecialRates_Request) {
        return this.http.post<Vehicle[]>(environment.apiURL + `carRental_booking/getAvailableVehicleSpecialRates/`, req);  
    }

    getVehicleAddons() {
        return this.http.get<VehicleAddon[]>(environment.apiURL + `carRental_vehicle/getVehicleAddons/`);
    }

    createVehicleAddon(addon: VehicleAddon) {
        return this.http.post(environment.apiURL + `carRental_vehicle/createVehicleAddon/`, addon);
    }

    updateVehicleAddon(addon: VehicleAddon) {
        return this.http.put(environment.apiURL + `carRental_vehicle/updateVehicleAddon/`, addon);        
    }

    deleteVehicleAddon(addonId: number) {
        return this.http.post(environment.apiURL + `carRental_vehicle/deleteVehicleAddon/`, addonId);  
    }

    findVehicleAddonConnections(vehicleId: number) {
        return this.http.get<VehicleAddonConnection[]>(environment.apiURL + `carRental_vehicle/findVehicleAddonConnections/${vehicleId}`);         
    }
}