import { Request, Response, NextFunction } from "express";
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema, source: 'body' | 'query' = 'body') => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const dataToValidate = source === 'query' ? req.query : req.body;
            
            // Log what we're validating (development only)
            if (process.env.NODE_ENV === 'development' && source === 'query') {
                console.log('Validating query params:', JSON.stringify(dataToValidate, null, 2));
            }
            
            // Parse and update the appropriate request property with validated/transformed data
            const result = schema.parse(dataToValidate);
            if (source === 'query') {
                // req.query is read-only, so we attach validated data to a custom property
                // The controller can access it via (req as any).validatedQuery or we can extend the type
                (req as any).validatedQuery = result;
                // Also try to update req.query properties if possible (for backward compatibility)
                try {
                    Object.keys(result as object).forEach(key => {
                        (req.query as any)[key] = (result as any)[key];
                    });
                } catch (e) {
                    // If we can't modify req.query, that's okay - use validatedQuery instead
                }
            } else {
                req.body = result;
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                console.error('Zod validation error:', error.issues);
                const errors = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message
                }));
                res.status(400).json({ message: 'Validation failed', errors });
            } else {
                console.error('Validation middleware error (non-Zod):', error);
                console.error('Error type:', error?.constructor?.name);
                console.error('Error message:', (error as Error)?.message);
                console.error('Error stack:', (error as Error)?.stack);
                res.status(400).json({ 
                    message: 'Invalid request', 
                    error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined 
                });
            }
        }
    };
};