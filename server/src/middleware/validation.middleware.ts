import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
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