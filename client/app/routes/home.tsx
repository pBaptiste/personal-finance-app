import type { Route } from "./+types/home";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { removeToken } from "~/lib/auth";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Personal Finance App" },
    { name: "description", content: "Personal Finance Dashboard" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-beige-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-preset-1 text-grey-900">Welcome to Personal Finance App</h1>
            <button
              onClick={handleLogout}
              className="bg-red text-white px-6 py-3 rounded-lg text-preset-4-bold hover:opacity-90 cursor-pointer"
            >
              Logout
            </button>
          </div>
          <p className="text-preset-4 text-grey-500">Your dashboard will appear here.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
