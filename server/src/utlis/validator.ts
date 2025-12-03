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

export const transactionQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    search: z.string().optional(),
    sortBy: z.enum(['Latest', 'Oldest', 'A to Z', 'Z to A', 'Highest', 'Lowest']).default('Latest'),
    category: z.string().optional(),
    type: z.enum(['income', 'expense']).optional(),
    dateFrom: z.coerce.date().optional(),
    dateTo: z.coerce.date().optional()
});

export type SignUpInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateTransactionInput = z.infer<typeof createTranasctionSchema>;
export type UpdateTransactionInput = z.infer<typeof updateTransactionSchema>;
export type TransactionQueryInput = z.infer<typeof transactionQuerySchema>;