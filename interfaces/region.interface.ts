export interface Region {
    id: number;
    zone_name: string;
    region_id: string;
    region_code: string;
    region_name: string;
    comment: string | null;
    region_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateRegion {
    id: number;
    zone_name: string;
    region_name: string;
    comment: string | null;
}
