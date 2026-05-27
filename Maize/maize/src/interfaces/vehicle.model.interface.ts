export interface VehicleModel {
    id: number;
    description: string;
    vehicle_category_id: number;
}

export interface VehicleModel_Request {
    id?: number;
    description?: string;
    vehicle_category_id?: number;
}