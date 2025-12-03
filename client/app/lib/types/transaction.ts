export interface Transaction {
    _id: string;
    userId: string;
    recipientOrSender: string;
    category: string;
    amount: number;
    transactionDate: string;
    type: 'income' | 'expense';
}

export interface CreateTransactionInput {
    recipientOrSender: string;
    category: string;
    amount: number;
    transactionDate: string;
    type: 'income' | 'expense';
  }

  export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

  export interface TransactionQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: 'Latest' | 'Oldest' | 'A to Z' | 'Z to A' | 'Highest' | 'Lowest';
    category?: string;
    type?: 'income' | 'expense';
    dateFrom?: string;
    dateTo?: string;
  }

  export interface TransactionsResponse {
    transactions: Transaction[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  }

  export interface MonthlySummary {
    income: number;
    expenses: number;
    balance: number;
  }