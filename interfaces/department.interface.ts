export interface Department {
    id: number;
    department_id: string;
    department_name: string;
    comment: string | null;
    created_by: string;
    modified_by: string | null;
    department_status: number;
    created_at: Date;
    modified_at: Date | null;
}

export interface UpdateDepartment {
    id: number;
    department_id: string;
    department_name: string;
    comment: string | null;
}
