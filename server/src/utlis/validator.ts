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

export type SignUpInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;