import type { Transaction } from "~/lib/types/transaction";
import { FaPencil } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";

interface TransactionsTableProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export default function TransactionsTable({ transactions, onEdit, onDelete}: TransactionsTableProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(Math.abs(amount));
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    if(transactions.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-preset-3 text-grey-900">No transactions found</p>
            </div>
        )
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-grey-100">
                        <th scope="col" className="text-left py-3 px-4 text-preset-5 text-grey-500">
                            Recipient/Sender
                        </th>
                        <th scope="col" className="text-left py-3 px-4 text-preset-5 text-grey-500">
                            Category
                        </th>
                        <th scope="col" className="text-left py-3 px-4 text-preset-5 text-grey-500">
                            Transaction Date
                        </th>
                        
                        <th scope="col" className="text-right py-3 px-4 text-preset-5 text-grey-500">
                            Amount
                        </th>
                       
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr 
                            key={transaction._id} 
                            className="border-b border-grey-100"
                        >
                            <td className="py-8 px-4 text-preset-4-bold text-grey-900">
                                {transaction.recipientOrSender}
                            </td>
                            <td className="py-8 px-4 text-preset-5 text-grey-500">
                                {transaction.category}
                            </td>
                            <td className="py-8 px-4 text-preset-5 text-grey-500">
                                {formatDate(transaction.transactionDate)}
                            </td>
                            
                            <td className={`py-7 px-4 text-right text-preset-4-bold ${transaction.amount < 0 ? 'text-red' : 'text-green'}`}>
                                {transaction.amount < 0 ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </td>
                            <td className="py-8 px-4">
                                <div className="flex gap-4 justify-end">
                                    <button 
                                        onClick={() => onEdit(transaction)}
                                        className="text-blue text-preset-3 cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2 focus-visible:rounded"
                                        aria-label={`Edit transaction with ${transaction.recipientOrSender}`}
                                    >
                                       <FaPencil />
                                    </button>
                                    <button 
                                        onClick={() => onDelete(transaction._id)}
                                        className="text-red cursor-pointer text-preset-3 focus:outline-none focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 focus-visible:rounded"
                                        aria-label={`Delete transaction with ${transaction.recipientOrSender}`}
                                    >
                                        <MdDelete />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}