export interface Vehicle {
    id: number;
    registration: string;
    model_id: number;
    vin: string;
    year: number;
    cc: number;
    color: string;
    gears: number;
    mileage: number;
    pool_type: number;
    state: number;
    insurance_company: string;
    insurance_expiry?: string;
    daily_rate?: number;
    passengers: number;
    air_condition: number;
    doors: number;
    radio: number;
    gps: number;
    touch_screen: number;
    parking_camera: number;
    usb: number;
    bluetooth: number;
    mirrorlink: number;
    license_required: number;
    driver_minimum_age: number;
}

export interface VehicleUpsert_Request {
    vehicle: Vehicle;
    addonIds: number[];
}

export interface Vehicle_Request {
    id?: number;
    registration?: string;
    model_id?: number;
    vin?: string;
    year?: number;
    cc?: number;
    color?: string;
    gears?: number;
    mileage?: number;
    pool_type?: number;
    state?: number;
    insurance_company?: string;
    insurance_expiry?: string;
    daily_rate?: number;
}