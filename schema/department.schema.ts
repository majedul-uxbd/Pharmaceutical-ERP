import * as z from 'zod';

export const CreateSchema = z.object({
    department_id: z.string().min(1, {
        message: 'Department ID is required',
    }),
    department_name: z.string().min(1, {
        message: 'Department name is required',
    }),
    comment: z.string().max(500, {
        message: 'Maximum 500 characters allowed',
    }),
});

export const RegisterSchema = z
    .object({
        firstName: z.string().min(4, {
            message: 'Minimum 4 characters required',
        }),
        lastName: z.string().min(4, {
            message: 'Minimum 4 characters required',
        }),
        email: z.string().email({
            message: 'Invalid email address',
        }),
        company: z.string().min(4, {
            message: 'Minimum 4 characters required',
        }),
        password: z.string().min(6, {
            message: 'Minimum 6 characters required',
        }),
        confirmPassword: z.string().min(6, {
            message: 'Minimum 6 characters required',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'], // Show the error message in the confirmPassword field
    });
