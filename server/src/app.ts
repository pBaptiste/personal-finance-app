import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utlis/db.js';
import authRoutes from './routes/auth.routes.js';

//Loading environment vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

//Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running'});
})

//Middleware error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

//Database connection
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running in port ${PORT}`);
        })
    } catch (error) {
        console.error('Failed to start server', error);
        process.exit(1);
    }
}

startServer();