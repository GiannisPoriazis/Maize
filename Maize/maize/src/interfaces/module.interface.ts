export interface Module {
    id: number;
    title: string;
    description: string;
    price?: number;
}

export interface ActiveModule {
    module_id: number;
    activated_by: number;
}