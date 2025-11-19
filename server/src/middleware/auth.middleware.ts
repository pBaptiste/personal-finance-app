import { Request, Response, NextFunction } from "express";
import { verifyToken, TokenPayload } from "../utlis/jwt.js";
import User from "../models/User.js";

//Extend express req to include user
export interface AuthRequest extends Request {
    user?: {
        _id: string;
        email: string;
        name: string;
    };
}

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        //Get token from authorization header
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            res.status(401).json({ message: 'Not authorized, no token provided'});
            return;
        }

        //verify token
        const decoded = verifyToken(token) as TokenPayload;

        //get user from token
        const user = await User.findById(decoded.userId).select('-password');

        if(!user) {
            res.status(401).json({ message: 'User not found'});
            return;
        }
        
        req.user = {
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
        };

        next();
    } catch (error: any) {
        res.status(401).json({ message: 'Not authorized, token failed'});
    }
};