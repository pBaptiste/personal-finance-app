import { Outlet } from "react-router";
import Navbar from "~/components/layout/Navbar";
import Sidebar from "~/components/layout/Sidebar";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { removeToken } from "~/lib/auth";
import { useNavigate } from "react-router";


export default function LayoutRoute() {
    const navigate = useNavigate();

    const handleLogout = () => {
      removeToken();
      navigate("/login");
    };
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-beige-100">
          <Navbar />
          <div className="lg:flex">
            <Sidebar />
            <main className="flex-1 pb-4 md:pb-8 lg:pb-0">
            <button
              onClick={handleLogout}
              className="text-preset-5-bold cursor-pointer border"
            >
              Logout
            </button>
              <Outlet />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }