export interface VehicleCategory {
    id: number;
    description: string;
    vehicle_type_id: number;
}

export interface VehicleCategory_Request {
    id?: number;
    description?: string;
    vehicle_type_id?: number;
}
  