export interface Designation {
    id: number;
    designation_id: string;
    designation_name: string;
    description: string | null;
    comment: string | null;
    created_by: string;
    modified_by: string | null;
    designation_status: boolean;
    created_at: Date;
    modified_at: Date | null;
}
