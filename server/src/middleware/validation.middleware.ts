import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            // Parse and update req.body with validated/transformed data
            const result = schema.parse(req.body);
            req.body = result;
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