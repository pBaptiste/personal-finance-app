# Phase 1: Project Setup & Authentication - Step-by-Step Guide

## Overview
This phase will set up the server infrastructure, database connection, authentication system, and basic login/signup pages.

---

## Step 1: Initialize Server Project

### 1.1 Create Server Directory Structure
Navigate to the `server` directory and create the following folder structure:

```
server/
├── src/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── utils/
├── package.json
├── tsconfig.json
└── .env
```

### 1.2 Initialize package.json
In the `server` directory, run:
```bash
npm init -y
```

Then update `package.json` with:
- Set `"type": "module"` for ES modules
- Add scripts for development and production
- Install dependencies (we'll do this in the next step)

### 1.3 Install Server Dependencies
Run these commands in the `server` directory:

```bash
# Core dependencies
npm install express mongoose jsonwebtoken bcryptjs cors dotenv

# Type definitions for TypeScript
npm install -D @types/express @types/node @types/jsonwebtoken @types/bcryptjs @types/cors typescript ts-node nodemon

# Optional: Validation library
npm install zod
```

**Key packages explained:**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variables
- `zod` - Schema validation

---

## Step 2: Configure TypeScript

### 2.1 Create tsconfig.json
Create `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "moduleResolution": "node",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2.2 Update package.json Scripts
Add these scripts to `server/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node --esm src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "typecheck": "tsc --noEmit"
  }
}
```

**Note:** For `nodemon` with ES modules, you may need a `nodemon.json` config file (see Step 2.3).

### 2.3 Create nodemon.json (Optional but Recommended)
Create `server/nodemon.json`:

```json
{
  "watch": ["src"],
  "ext": "ts,json",
  "exec": "ts-node --esm src/app.ts",
  "ignore": ["src/**/*.spec.ts", "node_modules"]
}
```

---

## Step 3: Set Up Environment Variables

### 3.1 Create .env File
Create `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Important:** 
- Replace `JWT_SECRET` with a strong random string in production
- Make sure MongoDB is running locally, or update `MONGODB_URI` to your MongoDB connection string

### 3.2 Create .env.example
Create `server/.env.example` (without actual secrets):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/personal-finance
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3.3 Add .env to .gitignore
Create or update `server/.gitignore`:

```
node_modules/
dist/
.env
*.log
.DS_Store
```

---

## Step 4: Set Up MongoDB Connection

### 4.1 Create Database Utility
Create `server/src/utils/db.ts`:

```typescript
import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(mongoURI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
```

---

## Step 5: Create Express App Setup

### 5.1 Create Main App File
Create `server/src/app.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';

// Load environment variables
dotenv.config();

// Import routes (we'll create these next)
// import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// app.use('/api/auth', authRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware (basic for now)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : undefined 
  });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
```

**Note:** The `.js` extensions in imports are required for ES modules with TypeScript.

---

## Step 6: Create User Model

### 6.1 Create User Model
Create `server/src/models/User.ts`:

```typescript
import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const bcrypt = await import('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
```

---

## Step 7: Create JWT Utilities

### 7.1 Create JWT Utility Functions
Create `server/src/utils/jwt.ts`:

```typescript
import jwt from 'jsonwebtoken';

export interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: TokenPayload): string => {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  return jwt.verify(token, secret) as TokenPayload;
};
```

---

## Step 8: Create Authentication Middleware

### 8.1 Create Auth Middleware
Create `server/src/middleware/auth.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.js';
import User from '../models/User.js';

// Extend Express Request to include user
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

    // Get token from Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorized, no token provided' });
      return;
    }

    // Verify token
    const decoded = verifyToken(token) as TokenPayload;

    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error: any) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};
```

---

## Step 9: Create Validation Middleware

### 9.1 Create Validation Utilities
Create `server/src/utils/validators.ts`:

```typescript
import { z } from 'zod';

// Signup validation schema
export const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').trim(),
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
```

### 9.2 Create Validation Middleware
Create `server/src/middleware/validation.middleware.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        res.status(400).json({ message: 'Validation failed', errors });
      } else {
        res.status(400).json({ message: 'Invalid request' });
      }
    }
  };
};
```

---

## Step 10: Create Authentication Controllers

### 10.1 Create Auth Controller
Create `server/src/controllers/auth.controller.ts`:

```typescript
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { SignupInput, LoginInput } from '../utils/validators.js';
import { AuthRequest } from '../middleware/auth.middleware.js';

export const signup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password }: SignupInput = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password, // Will be hashed by pre-save hook
    });

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error creating user', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password }: LoginInput = req.body;

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Error during login', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // User is already attached to req by protect middleware
    const user = await User.findById(req.user!._id).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error('Get me error:', error);
    res.status(500).json({ 
      message: 'Error fetching user', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};
```

---

## Step 11: Create Authentication Routes

### 11.1 Create Auth Routes
Create `server/src/routes/auth.routes.ts`:

```typescript
import express from 'express';
import { signup, login, getMe } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { signupSchema, loginSchema } from '../utils/validators.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

export default router;
```

### 11.2 Update app.ts to Use Auth Routes
Update `server/src/app.ts` to uncomment and use the auth routes:

```typescript
import authRoutes from './routes/auth.routes.js';

// ... existing code ...

// Routes
app.use('/api/auth', authRoutes);
```

---

## Step 12: Test Server Setup

### 12.1 Start MongoDB
Make sure MongoDB is running:
```bash
# If using local MongoDB
mongod

# Or if using MongoDB as a service
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongod  # Linux
```

### 12.2 Start the Server
In the `server` directory:
```bash
npm run dev
```

You should see:
- "MongoDB Connected: ..."
- "Server running on port 5000"

### 12.3 Test Health Endpoint
Open your browser or use curl:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 12.4 Test Signup Endpoint
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Expected response:
```json
{
  "message": "User created successfully",
  "token": "...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

### 12.5 Test Login Endpoint
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 12.6 Test Protected Route
```bash
# Replace YOUR_TOKEN with the token from signup/login response
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Step 13: Set Up Client-Side Authentication

### 13.1 Create API Client Utility
Create `client/app/lib/api.ts`:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiError {
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient(API_URL);
```

### 13.2 Create Auth Utilities
Create `client/app/lib/auth.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
```

### 13.3 Create Client Environment File
Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## Step 14: Create Login and Signup Pages

### 14.1 Create Login Route
Create `client/app/routes/login.tsx`:

```typescript
import { Form, useActionData, useNavigation, redirect } from "react-router";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import type { Route } from "./+types/login";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string };
    }>("/auth/login", { email, password });

    setToken(response.token);
    return redirect("/home");
  } catch (error: any) {
    return {
      error: error.message || "Login failed. Please try again.",
    };
  }
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{actionData.error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign up
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
```

### 14.2 Create Signup Route
Create `client/app/routes/signup.tsx`:

```typescript
import { Form, useActionData, useNavigation, redirect } from "react-router";
import { api } from "../lib/api";
import { setToken } from "../lib/auth";
import type { Route } from "./+types/signup";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const response = await api.post<{
      message: string;
      token: string;
      user: { id: string; name: string; email: string };
    }>("/auth/signup", { name, email, password });

    setToken(response.token);
    return redirect("/home");
  } catch (error: any) {
    return {
      error: error.message || "Signup failed. Please try again.",
    };
  }
}

export default function Signup() {
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          {actionData?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{actionData.error}</p>
            </div>
          )}
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password (min. 6 characters)"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Sign up"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </a>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
}
```

### 14.3 Update Routes Configuration
Update `client/app/routes.ts`:

```typescript
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("signup", "routes/signup.tsx"),
] satisfies RouteConfig;
```

---

## Step 15: Create Protected Route Component

### 15.1 Create Protected Route
Create `client/app/components/ProtectedRoute.tsx`:

```typescript
import { Navigate } from "react-router";
import { isAuthenticated } from "../lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

### 15.2 Update Home Route to Use Protected Route
Update `client/app/routes/home.tsx`:

```typescript
import { ProtectedRoute } from "../components/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Welcome to Personal Finance App</h1>
        <p className="mt-4 text-gray-600">Your dashboard will appear here.</p>
      </div>
    </ProtectedRoute>
  );
}
```

---

## Step 16: Testing Checklist

### Server Tests
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Health endpoint returns OK
- [ ] Signup creates user and returns token
- [ ] Login with valid credentials returns token
- [ ] Login with invalid credentials returns error
- [ ] Protected route requires valid token
- [ ] Protected route returns user info

### Client Tests
- [ ] Can navigate to `/login`
- [ ] Can navigate to `/signup`
- [ ] Signup form submits and redirects to `/home`
- [ ] Login form submits and redirects to `/home`
- [ ] Token is stored in localStorage
- [ ] Accessing `/home` without token redirects to `/login`
- [ ] Accessing `/home` with valid token shows the page

---

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Make sure MongoDB is running
   - Check `MONGODB_URI` in `.env`
   - Verify MongoDB is accessible

2. **TypeScript Import Errors with `.js` extensions**
   - This is required for ES modules
   - Make sure all imports use `.js` extensions

3. **CORS Errors**
   - Check `CLIENT_URL` in server `.env`
   - Verify client is running on the correct port

4. **Token Not Working**
   - Check `JWT_SECRET` is set
   - Verify token is being sent in Authorization header
   - Check token hasn't expired

---

## Next Steps

Once Phase 1 is complete:
1. Test all authentication flows
2. Verify error handling works correctly
3. Move to Phase 2: Navigation & Layout

---

## Summary

You've now set up:
✅ Express server with TypeScript
✅ MongoDB connection
✅ User model with password hashing
✅ JWT authentication
✅ Signup and login endpoints
✅ Protected routes middleware
✅ Login and signup pages
✅ Client-side API utilities
✅ Protected route component

The authentication foundation is complete!

