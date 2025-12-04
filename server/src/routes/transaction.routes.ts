import express from 'express';
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from '../controllers/transaction.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { createTranasctionSchema, updateTransactionSchema, transactionQuerySchema } from '../utlis/validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/', validate(transactionQuerySchema, 'query'), getTransactions);
router.post('/', validate(createTranasctionSchema), createTransaction);
router.put('/:id', validate(updateTransactionSchema), updateTransaction);
router.delete('/:id', deleteTransaction);

export default router;