import { VehicleBookingAddon } from "./vehicle.booking.addon.interface";

export interface VehicleBooking {
    id: number;
    client_id: number;
    vehicle_id: number;
    date_from?: string;
    date_to?: string;
    time_from?: string;
    time_to?: string;
    checkout?: number;
    checkin?: number;
    total_price: number;
    billing_type: number;
    billing_name: string;
    billing_tax: string;
    billing_country: string;
    discount: number;
    vat: number;
}

export interface VehicleBooking_Request {
    id?: number;
    client_id?: number;
    vehicle_id?: number;
    date_from?: string;
    date_to?: string;
    checkout?: number;
    checkin?: number;
    total_price?: number;
    billing_type?: number;
    billing_name?: string;
    billing_tax?: string;
    billing_country?: string;
    discount?: number;
    vat?: number;
}

export interface CarRental_CreateBooking_Request
{
    booking: VehicleBooking;
    addons: VehicleBookingAddon[];
}