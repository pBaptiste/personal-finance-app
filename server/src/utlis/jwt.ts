import jwt, { SignOptions } from "jsonwebtoken";
import type { StringValue } from "ms";

export interface TokenPayload {
    userId: string;
    email: string;
}

export const generateToken = (payload: TokenPayload): string => {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environmental variable');
    }

    const expiresIn = (process.env.JWT_EXPIRES_IN || '7d') as StringValue;
    const options: SignOptions = { expiresIn };
    
    return jwt.sign(payload, secret, options);
}

export const verifyToken = (token: string): TokenPayload => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error('JWT_SECRET is not defined in environmental variable');
    }

    return jwt.verify(token, secret) as TokenPayload;
}