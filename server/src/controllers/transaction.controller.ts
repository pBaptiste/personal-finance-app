import { Response } from "express";
import Transaction from "../models/Transaction";
import { CreateTransactionInput, UpdateTransactionInput, TransactionQueryInput } from "../utlis/validator";
import { AuthRequest } from "../middleware/auth.middleware";

export const getTransactions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;
        // Use validatedQuery if available (from validation middleware), otherwise fall back to req.query
        const query = ((req as any).validatedQuery || req.query) as unknown as TransactionQueryInput;

        const filter: any = { userId };

        if(query.search) {
            filter.$or = [
                {
                    recipientOrSender: { 
                        $regex: query.search,
                         $options: 'i',
                    },
                   
                },
                {
                    category: {
                        $regex: query.search, 
                        $options: 'i'
                    }
                }
            ]
        }

        if(query.category) {
            filter.category = query.category;
        }

        if(query.type) {
            filter.type = query.type;
        }

        if(query.dateFrom || query.dateTo) {
            filter.transactionDate = {};
            if(query.dateFrom) {
                filter.transactionDate.$gte = query.dateFrom;
            }
            if(query.dateTo) {
                filter.transactionDate.$lte = query.dateTo
            }
        }

        //Sort By
        let sort: any = {};

        switch(query.sortBy){
            case 'Latest':
                sort = { transactionDate: -1};
                break;
            case 'Oldest':
                sort = { transactionDate: 1 };
                break;
            case 'A to Z':
                sort = { recipientOrSender: 1 };
                break;
            case 'Z to A':
                sort = { recipientOrSender: -1 };
                break;
            case 'Highest':
                sort = { amount: -1 };
                break;
            case 'Lowest':
                sort = { amount: 1 };
                break;
            default:
                sort = { transactionDate: -1};
        }

        //Pagination
        const page = query.page;
        const limit = query.limit;
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            Transaction.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(limit)
            .lean(),
            Transaction.countDocuments(filter),
        ]);

        res.json({
            transactions,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        });

    } catch (error: any) {
        console.error('Get transaction error', error);
        res.status(500).json({
            message: 'Error fetching transactions',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const createTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;
        const data: CreateTransactionInput = req.body;

        //Ensure amount is negative for expenses
        const amount = data.type === 'expense' ? -Math.abs(data.amount): Math.abs(data.amount);

        const transaction = await Transaction.create({
            ...data,
            userId,
            amount,
        });

        res.status(201).json({
            message: 'Transaction created successfully',
            transaction,
        });
    } catch (error: any) {
        console.error('Create transaction error:', error);
        res.status(500).json({
            message: 'Error creating transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const updateTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;
        const { id } = req.params;
        const data: UpdateTransactionInput = req.body;

        // Find the transaction and verify ownership
        const transaction = await Transaction.findOne({ _id: id, userId });
        
        if (!transaction) {
            res.status(404).json({
                message: 'Transaction not found',
            });
            return;
        }

        // Prepare update data
        const updateData: any = { ...data };

        // If amount or type is being updated, recalculate the amount
        if (data.amount !== undefined || data.type !== undefined) {
            const finalType = data.type || transaction.type;
            const finalAmount = data.amount !== undefined ? data.amount : Math.abs(transaction.amount);
            // Ensure amount is negative for expenses
            updateData.amount = finalType === 'expense' ? -Math.abs(finalAmount) : Math.abs(finalAmount);
        }

        // Update the transaction
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        res.json({
            message: 'Transaction updated successfully',
            transaction: updatedTransaction,
        });
    } catch (error: any) {
        console.error('Update transaction error:', error);
        res.status(500).json({
            message: 'Error updating transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

export const deleteTransaction = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user!._id;
        const { id } = req.params;

        // Find the transaction and verify ownership
        const transaction = await Transaction.findOne({ _id: id, userId });
        
        if (!transaction) {
            res.status(404).json({
                message: 'Transaction not found',
            });
            return;
        }

        // Delete the transaction
        await Transaction.findByIdAndDelete(id);

        res.json({
            message: 'Transaction deleted successfully',
        });
    } catch (error: any) {
        console.error('Delete transaction error:', error);
        res.status(500).json({
            message: 'Error deleting transaction',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}