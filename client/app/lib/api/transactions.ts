import { api } from "../api";
import type { Transaction, CreateTransactionInput, UpdateTransactionInput, TransactionQueryParams, TransactionsResponse, MonthlySummary } from "../types/transaction"

export const transactionApi = {
    getAll: (params?: TransactionQueryParams, token?: string | null, cookieHeader?: string | null): Promise<TransactionsResponse> => {
        //Create a new instance of URLSearchParams to construct safe URL query strings
        const queryString = new URLSearchParams();
       //Check if params object is provided
        if(params) {
             //Loops through all key/value pairs in params 
            Object.entries(params).forEach(([key, value]) => {
                //skip parameters that are: undefined, null, empty string
                if(value !== undefined && value !== null && value !== '') {
                    //Appends valid parameters to the queryString
                    queryString.append(key, String(value));
                }
            });
        }
        //Convert to a real query string
        const query = queryString.toString();
        //Make the Actual API Request
        return api.get<TransactionsResponse>(`/transactions${query ? `?${query}` : ''}`, token, cookieHeader);
    },

    getById: (id: string): Promise<{ transaction: Transaction }> => {
        return api.get<{ transaction: Transaction }>(`/transactions/${id}`);
    },

    create: (data: CreateTransactionInput, token?: string | null, cookieHeader?: string | null): Promise<{ message: string; transaction: Transaction }> => {
        return api.post<{ message: string; transaction: Transaction }>('/transactions', data, token, cookieHeader)
    },

    update: (id: string, data: UpdateTransactionInput, token?: string | null, cookieHeader?: string | null): Promise<{ message: string; transaction: Transaction}> => {
        return api.put<{ message: string; transaction: Transaction }>(`/transactions/${id}`, data, token, cookieHeader);
    },

    delete: (id: string, token?: string | null, cookieHeader?: string | null): Promise<{ message: string }> => {
        return api.delete<{ message: string }>(`/transactions/${id}`, token, cookieHeader);
    },

    getCategories: (): Promise<{ categories: string[] }> => {
        return api.get<{ categories: string[] }>('/transactions/categories');
      },

    getMonthlySummary: (year: number, month: number): Promise<MonthlySummary> => {
        return api.get<MonthlySummary>(`/transactions/summary/monthly?year=${year}&month=${month}`);
    },
}