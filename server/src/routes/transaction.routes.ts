import express from 'express';
import {
    getTransactions,
    createTransaction
} from '../controllers/transaction.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createTranasctionSchema, transactionQuerySchema } from '../utlis/validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', (req, res, next) => {
    console.log('GET /api/transactions route hit');
    next();
}, getTransactions);
router.post('/', validate(createTranasctionSchema), createTransaction);

export default router;