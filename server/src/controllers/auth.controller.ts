import { Response } from "express";
import bcrypt from 'bcryptjs';
import User from "../models/User.js";
import { generateToken } from "../utlis/jwt.js";
import { SignUpInput, LoginInput } from "../utlis/validator.js";
import { AuthRequest } from "../middleware/auth.middleware.js";

export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { name, email, password}: SignUpInput = req.body;

        //Check if user already exists
        const existingUser = await User.findOne({ email });

        if(existingUser) {
            res.status(400).json({ message: 'User with this email already exists'});
            return;
        }

        //Create user
        const user = await User.create({
            name,
            email,
            password
        });

        //Generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email
        });

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error: any) {
        console.error('Signup error', error);

        res.status(500).json({
            message: 'Error creating user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const login = async (req: AuthRequest, res: Response) => {
    try {
        const { email, password }: LoginInput = req.body;

        //Find user and select the password
        const user = await User.findOne({ email }).select('+password');

        if(!user) {
            res.status(401).json({ message: 'Invalid email or password'});
            return;
        }

        //check passowrd
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            res.status(401).json({ message: 'Invalid email or password'});
            return;
        }

        //generate token
        const token = generateToken({
            userId: user._id.toString(),
            email: user.email
        });

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error: any) {
        console.error('Login error', error);

        res.status(500).json({
            message: 'Error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await User.findById(req.user!._id).select('-password');

        if(!user) {
            res.status(404).json({ message: 'User not found'});
            return;
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })
    } catch (error: any) {
        console.error('Get me error', error);

        res.status(500).json({
            message: 'Error fetching user',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}