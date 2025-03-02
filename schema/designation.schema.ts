import * as z from 'zod';

export const CreateSchema = z.object({
    designation_id: z
        .string()
        .min(1, {
            message: 'Designation ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    designation_name: z
        .string()
        .min(1, {
            message: 'Designation name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
        short_name : z
        .string()
        .min(1, {
            message: 'Short name is required',
        })
        .max(45, {
            message: 'Maximum 45 characters allowed',
        }),
        description: z.string().max(500, {
            message: 'Maximum 500 characters allowed',
        }),
        comment: z.string().max(500, {
        message: 'Maximum 500 characters allowed',
    }),
});

export const UpdateSchema = z.object({
    designation_id: z
        .string()
        .min(1, {
            message: 'Designation ID is required',
        })
        .max(10, {
            message: 'Maximum 10 characters allowed',
        }),
    designation_name: z
        .string()
        .min(1, {
            message: 'Designation name is required',
        })
        .max(100, {
            message: 'Maximum 100 characters allowed',
        }),
        short_name : z
        .string()
        .min(1, {
            message: 'Short name is required',
        })
        .max(45, {
            message: 'Maximum 45 characters allowed',
        }),
        description: z
        .string()
        .max(500, {
            message: 'Maximum 500 characters allowed',
        }),
    comment: z
        .string()
        .max(500, {
            message: 'Maximum 500 characters allowed',
        })
        .nullable(),
});
