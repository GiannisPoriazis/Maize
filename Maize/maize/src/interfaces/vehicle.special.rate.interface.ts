import { Vehicle } from "./vehicle.interface";

export interface VehicleSpecialRate {
    id: number;
    vehicle_id?: number;
    vehicle_model_id?: number;
    vehicle_category_id?: number;
    vehicle_type_id?: number;
    discount?: number;
    markup?: number;
    isPercentage: number;
    start_date: string;
    expiry_date?: string;
}

export interface VehicleSpecialRate_Request {
    id?: number;
    vehicle_id?: number;
    vehicle_model_id?: number;
    vehicle_category_id?: number;
    vehicle_type_id?: number;
    discount?: number;
    markup?: number;
    isPercentage?: number;
    start_date?: string;
    expiry_date?: string;
}

export interface GetVehicleSpecialRates_Request {
    bookingDate: string;
    vehicles: Vehicle[];
}