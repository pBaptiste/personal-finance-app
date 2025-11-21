import type { Route } from "./+types/transactions";

export function meta({}: Route.MetaArgs) {
    return [
      { title: "Transactions - Personal Finance App" },
      { name: "description", content: "View and manage your transactions" },
    ];
  }

  export default function Transactions() {
    return (
      <div className="p-8">
        <h1 className="text-preset-1 text-grey-900 mb-4">Transactions</h1>
        <p className="text-preset-4 text-grey-500">Transactions pages...</p>
      </div>
    );
  }
