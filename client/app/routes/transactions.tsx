import type { Route } from "./+types/transactions";
import { useState, useEffect } from "react";
import TransactionForm from "~/components/transactions/TransactionForm";
import { useActionData, useRevalidator } from "react-router";
import { transactionApi } from "~/lib/api/transactions";
import type { Transaction, TransactionQueryParams } from "~/lib/types/transaction";


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

    try {
      const data = await transactionApi.getAll(params);
      return {
        transactions: data.transactions,
        pagination: data.pagination,
        params
      }
    } catch (error: any) {
      return {
        transactions: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0
        },
        params,
        error: error.message
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
    const actionData = useActionData<typeof action>();
    const revalidator = useRevalidator();
    const [ showForm, setShowForm ] = useState(false);

    useEffect(() => {
      if(actionData?.success) {
        setShowForm(false);
        revalidator.revalidate();
      }
    }, [actionData, revalidator])
    return (
      <div className="p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between">
          <h1 className="text-preset-1 text-grey-900 mb-4">Transactions</h1>
          <button 
            onClick={() => {
              setShowForm(true);
            }}
            className="p-4 bg-grey-900 hover:bg-grey-500 text-white text-preset-4-bold rounded-lg cursor-pointer ">+ Add New Transaction</button>
        </div>
       
        <p className="text-preset-4 text-grey-500">Transactions pages...</p>

        {
          showForm && (
            <TransactionForm 
              onClose={() => {
                setShowForm(false);
              }} />
          )
        }
      </div>
    );
  }
