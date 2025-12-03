import type { Route } from "./+types/transactions";
import { useState, useEffect } from "react";
import TransactionForm from "~/components/transactions/TransactionForm";
import { useActionData, useRevalidator, useLoaderData } from "react-router";
import { transactionApi } from "~/lib/api/transactions";
import type { Transaction, TransactionQueryParams } from "~/lib/types/transaction";
import TransactionsTable from "~/components/transactions/TransactionsTable";

export function meta({}: Route.MetaArgs) {
    return [
      { title: "Transactions - Personal Finance App" },
      { name: "description", content: "View and manage your transactions" },
    ];
  }

  export async function loader({ request }: Route.LoaderArgs) {
    const url = new URL(request.url);
    const sortByParam = url.searchParams.get("sortBy");
    const typeParam = url.searchParams.get("type");
    const params: TransactionQueryParams = {
      page: Number(url.searchParams.get("page")) || 1,
      limit: Number(url.searchParams.get("limit")) || 10,
      search: url.searchParams.get("search") || undefined,
      sortBy: (sortByParam === "Latest" || sortByParam === "Oldest" || sortByParam === "A to Z" || sortByParam === "Z to A" || sortByParam === "Highest" || sortByParam === "Lowest") ? sortByParam : "Latest",
      category: url.searchParams.get("category") || undefined,
      type: (typeParam === "income" || typeParam === "expense") ? typeParam : undefined,
      dateFrom: url.searchParams.get("dateFrom") || undefined,
      dateTo: url.searchParams.get("dateTo") || undefined,
    }

    // Get token from cookies for server-side requests
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
    const token = cookies.token || null;

    // Also try to get token from localStorage if available (client-side)
    // Note: In React Router v7, loaders can run on both server and client
    let clientToken: string | null = null;
    if (typeof window !== 'undefined') {
      clientToken = localStorage.getItem('token');
    }

    // Use client token if available, otherwise use cookie token
    const finalToken = clientToken || token;

    try {
      const data = await transactionApi.getAll(params, finalToken, cookieHeader || null);
      return {
        transactions: data.transactions,
        pagination: data.pagination,
        params
      }
    } catch (error: any) {
      console.error('Loader error:', {
        message: error.message,
        stack: error.stack,
        token: finalToken ? 'present' : 'missing',
        cookieHeader: cookieHeader ? 'present' : 'missing',
      });
      return {
        transactions: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        params,
        error: error.message || 'Failed to load transactions'
      }
    }
  }

  export async function action({ request }: Route.ActionArgs) {
    const formData = await request.formData();
    const method = request.method;

    // Get token from cookies for server-side requests
    const cookieHeader = request.headers.get("Cookie") || "";
    const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) {
        acc[key] = decodeURIComponent(value);
      }
      return acc;
    }, {} as Record<string, string>);
    const token = cookies.token || null;

    try {
      if(method === "POST") {
        const data = {
          recipientOrSender: formData.get("recipientOrSender") as string,
          category: formData.get("category") as string,
          amount: Number(formData.get("amount")),
          transactionDate: formData.get("transactionDate") as string,
          type: formData.get("type") as "income" | "expense",
        }
        await transactionApi.create(data, token, cookieHeader || null);
        return { success: true };
      }

      if (method === "PUT") {
        const id = formData.get("id") as string;
        const data = {
          recipientOrSender: formData.get("recipientOrSender") as string,
          category: formData.get("category") as string,
          amount: Number(formData.get("amount")),
          transactionDate: formData.get("transactionDate") as string,
          type: formData.get("type") as "income" | "expense",
        }
        await transactionApi.update(id, data, token, cookieHeader || null);
        return { success: true };
      }

      if(method === "DELETE") {
        const id = formData.get("id") as string;
        await transactionApi.delete(id, token, cookieHeader || null);
        return { success: true };
      }

      return { error: "Invalid request method" };
    } catch (error: any) {
      return {
        error: error.message || "An error has occurred"
      }
    }
  }

 

  export default function Transactions() {
    const loaderData = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const revalidator = useRevalidator();
    const transactions = loaderData.transactions || [];
    const [ showForm, setShowForm ] = useState(false);
    const [ editingTransaction, setEditingTransaction ] = useState<Transaction | undefined>(undefined);

    useEffect(() => {
      if(actionData?.success) {
        setShowForm(false);
        setEditingTransaction(undefined);
        revalidator.revalidate();
      }
    }, [actionData, revalidator])

    const handleEdit = (transaction: Transaction) => {
      setEditingTransaction(transaction);
      setShowForm(true);
    };
  
    const handleDelete = () => {}

    const handleClose = () => {
      setShowForm(false);
      setEditingTransaction(undefined);
    };
    return (
      <div className="p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-preset-1 text-grey-900 mb-4">Transactions</h1>
          <button 
            onClick={() => {
              setShowForm(true);
            }}
            className="p-4 bg-grey-900 hover:bg-grey-500 text-white text-preset-4-bold rounded-lg cursor-pointer ">+ Add New Transaction</button>
        </div>
        
        {loaderData.error && (
          <div className="mb-4 p-4 bg-red bg-opacity-10 text-white rounded-lg text-preset-4">
            Error loading transactions: {loaderData.error}
          </div>
        )}
        
        <div className="bg-white shadow-lg rounded-xl p-8 mb-8">
          <TransactionsTable 
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
            />
        </div>
        
        {
          showForm && (
            <TransactionForm 
              transaction={editingTransaction}
              onClose={handleClose} />
          )
        }
      </div>
    );
  }
