import { z } from 'zod';

//Sign up validation schema
export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

//Log in validation schema
export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase().trim(),
    password: z.string().min(1, 'Password is required'),
});

//Transaction validation schemas
export const createTranasctionSchema = z.object({
    recipientOrSender: z.string().min(1, 'Recipient/Sender is required').trim(),
    category: z.string().min(1, 'Category is required').trim(),
    amount: z.number().positive('Amount must be positive'),
    transactionDate: z.coerce.date(),
    type: z.enum(['income', 'expense'], {
        message: 'Type must be either income or expense'
    })
});

//Transforms the schema so that all fields become optional on update
export const updateTransactionSchema = createTranasctionSchema.partial();

// Helper function to safely parse number with default
const safeNumber = (val: unknown, defaultVal: number): number => {
    try {
        if (val === undefined || val === null || val === '') return defaultVal;
        const num = Number(val);
        return isNaN(num) || num < 1 ? defaultVal : Math.floor(num);
    } catch {
        return defaultVal;
    }
};

// Helper function to safely parse date
const safeDate = (val: unknown): Date | undefined => {
    try {
        if (val === undefined || val === null || val === '') return undefined;
        const date = val instanceof Date ? val : new Date(val as string);
        return isNaN(date.getTime()) ? undefined : date;
    } catch {
        return undefined;
    }
};

export const transactionQuerySchema = z.object({
    page: z.preprocess(
        (val) => {
            try {
                return safeNumber(val, 1);
            } catch {
                return 1;
            }
        },
        z.number().int().positive()
    ).optional().default(1),
    limit: z.preprocess(
        (val) => {
            try {
                return safeNumber(val, 10);
            } catch {
                return 10;
            }
        },
        z.number().int().positive().max(100)
    ).optional().default(10),
    search: z.string().optional(),
    sortBy: z.preprocess(
        (val) => {
            try {
                if (!val || val === '') return 'Latest';
                const valid = ['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'];
                return valid.includes(val as string) ? val : 'Latest';
            } catch {
                return 'Latest';
            }
        },
        z.enum(['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest'])
    ).optional().default('Latest'),
    category: z.string().optional(),
    type: z.preprocess(
        (val) => {
            try {
                if (!val || val === '') return undefined;
                return (val === 'income' || val === 'expense') ? val : undefined;
            } catch {
                return undefined;
            }
        },
        z.enum(['income', 'expense']).optional()
    ),
    dateFrom: z.preprocess(
        (val) => {
            try {
                return safeDate(val);
            } catch {
                return undefined;
            }
        },
        z.date().optional()
    ),
    dateTo: z.preprocess(
        (val) => {
            try {
                return safeDate(val);
            } catch {
                return undefined;
            }
        },
        z.date().optional()
    )
});

export type SignUpInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTransactionInput = z.infer<typeof createTranasctionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;