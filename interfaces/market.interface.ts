export interface Market {
    id: number;
    region_name: string;
    market_id: string;
    market_code: string;
    market_name: string;
    comment: string | null;
    market_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateMarket {
    id: number;
    region_name: string;
    market_name: string;
    comment: string | null;
}
