import mongoose, { Schema, Document} from "mongoose";

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    recipientOrSender: string;
    category: string;
    amount: number;
    transactionDate: Date;
    type: 'income' | 'expense';
    createdAt: 'Date';
    updatedAt: 'Date';
}

const transactionSchema = new Schema<ITransaction> (
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true
        },
        recipientOrSender: {
            type: String,
            required: true,
            trim: true
        },
        category: {
            type: String,
            required: true,
            trim: true
        },
        amount: {
            type: Number,
            required: true
        },
        transactionDate: {
            type: Date,
            required: true,
            default: Date.now
        },
        type: {
            type: String,
            enum: ['income', 'expense'],
            required: true
        }
    },
    {
        timestamps: true
    }
);

//index for sorting & filtering transactions by date & categories
transactionSchema.index({ userId: 1, transactionDate: -1});
transactionSchema.index({ userId: 1, category: 1 });

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;