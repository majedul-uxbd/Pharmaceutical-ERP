export interface Zone {
    id: number;
    depot_name: string;
    zone_name: string;
    zone_code: string;
    comment: string | null;
    zone_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateZone {
    id: number;
    depot_name: string;
    zone_name: string;
    zone_code: string;
    comment: string | null;
}
