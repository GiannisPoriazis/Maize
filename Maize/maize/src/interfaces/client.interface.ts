export interface Client {
    id: number;
    email: string;
    mobile_phone?: string;
    first_name: string;
    last_name: string;
    taxId?: string;
    birth_date?: string;
    created_at?: string;
}
  
export interface Client_Request {
    id?: number;
    email?: string;
    mobile_phone?: string;
    first_name?: string;
    last_name?: string;
    taxId?: string;
    birth_date?: string;
    created_at?: string;
}