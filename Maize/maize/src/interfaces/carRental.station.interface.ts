export interface CarRentalStation {
    id: number;
    station_name: string;
    station_address?: string;
}

export interface CarRentalStation_Request {
    id?: number;
    station_name?: string;
    station_address?: string;
}  