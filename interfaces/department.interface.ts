export interface Department {
    id: number;
    department_id: string;
    department_name: string;
    comment: string | null;
    created_by: string;
    modified_by: string | null;
    department_status: boolean;
    created_at: Date;
    modified_at: Date | null;
}
