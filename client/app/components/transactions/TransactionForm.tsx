import { Form, useActionData, useNavigation } from "react-router";
import { useState, useEffect } from "react";
import closeModal from "../../images/icon-close-modal.svg";
import Dropdown, { type DropdownOption } from "../ui/Dropdown";

interface TransactionFormProps {
  transaction?: {
    _id: string;
    recipientOrSender: string;
    category: string;
    amount: number;
    transactionDate: string;
    type: 'income' | 'expense';
  };
  onClose: () => void;
}

const categories = [
  'Entertainment',
  'Bills',
  'Groceries',
  'Dining Out',
  'Transportation',
  'Personal Care',
  'Education',
  'Lifestyle',
  'Shopping',
  'Gift or Donation',
  'General',
  'Other',
];

const typeOptions: DropdownOption[] = [
  { value: 'expense', label: 'Expense' },
  { value: 'income', label: 'Income' },
];

const categoryOptions: DropdownOption[] = categories.map(cat => ({
  value: cat,
  label: cat,
}));

export default function TransactionForm({ transaction, onClose }: TransactionFormProps) {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [formData, setFormData] = useState({
    recipientOrSender: transaction?.recipientOrSender || '',
    category: transaction?.category || '',
    amount: transaction ? Math.abs(transaction.amount).toString() : '',
    transactionDate: transaction?.transactionDate 
      ? new Date(transaction.transactionDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    type: transaction?.type || 'expense',
  });

  useEffect(() => {
    if (actionData?.success) {
      onClose();
    }
  }, [actionData, onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20 p-5">
      {/* Modal  */}
      <div className="bg-white max-w-140 w-full rounded-xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-grey-900 text-preset-2 md:text-preset-1">
            {transaction ? 'Edit Transaction' : 'Add New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="cursor-pointer" 
            aria-label="Close Modal"
          >
            <img src={closeModal} alt="Close Modal"/>
          </button>
        </div>
        <p className="text-grey-500 text-preset-4 mb-5">
          {transaction ? 'Update your transaction details' : 'Document your cash flow and gain greater insights into your financial habits'}
        </p>

        {actionData?.error && (
          <div className="mb-4 p-3 bg-red text-white rounded-lg text-preset-4">
            {actionData.error}
          </div>
        )}

        <Form 
          className="space-y-4"
          method={transaction ? "put" : "post"}>
          {transaction && (
            <input type="hidden" name="id" value={transaction._id} />
          )}

          <Dropdown
            id="type"
            name="type"
            label="Type"
            value={formData.type}
            options={typeOptions}
            onChange={(value) => setFormData({ ...formData, type: value as 'income' | 'expense' })}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="recipientOrSender" className="text-grey-500 text-preset-5-bold">
              {formData.type === 'income' ? 'Sender' : 'Recipient'}
            </label>
            <input
              type="text"
              id="recipientOrSender"
              name="recipientOrSender"
              value={formData.recipientOrSender}
              onChange={(e) => setFormData({ ...formData, recipientOrSender: e.target.value })}
              className="border border-grey-500 rounded-lg py-3 px-5 text-preset-4 text-grey-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2"
              required
            />
          </div>

          <Dropdown
            id="category"
            name="category"
            label="Category"
            value={formData.category}
            options={categoryOptions}
            onChange={(value) => setFormData({ ...formData, category: value })}
            placeholder="Select a category"
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="amount" className="text-grey-500 text-preset-5-bold">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-preset-4 text-grey-900 pointer-events-none">
                $
              </span>
              <input
                type="number"
                id="amount"
                name="amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                step="0.01"
                min="0"
                className="border border-grey-500 rounded-lg py-3 pl-8 pr-5 text-preset-4 text-grey-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2 w-full"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="transactionDate" className="text-grey-500 text-preset-5-bold">
              Date
            </label>
            <input
              type="date"
              id="transactionDate"
              name="transactionDate"
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              className="border border-grey-500 rounded-lg py-3 px-5 text-preset-4 text-grey-900 focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2"
              required
            />
          </div>

            <button
              type="submit"
              className="mt-1 w-full cursor-pointer px-1 py-4 bg-grey-900 hover:bg-grey-500 text-white rounded-lg text-preset-4-bold focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : transaction ? 'Update Transaction' : 'Add Transaction'}
            </button>
       
        </Form>
      </div>
    </div>
  );
}
  