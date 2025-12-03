import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema, source: 'body' | 'query' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = source === 'query' ? req.query : req.body;
            // Parse and update the appropriate request property with validated/transformed data
            const result = schema.parse(dataToValidate);
            if (source === 'query') {
                req.query = result as any;
            } else {
                req.body = result;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));
                res.status(400).json({ message: 'Validation failed', errors });
            } else {
                res.status(400).json({ message: 'Invalid request' });
            }
        }
    };
};