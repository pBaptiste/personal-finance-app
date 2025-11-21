import { Outlet } from "react-router";
import Navbar from "~/components/layout/Navbar";
import Sidebar from "~/components/layout/Sidebar";
import { ProtectedRoute } from "~/components/ProtectedRoute";

export default function LayoutRoute() {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-beige-100">
          <Navbar />
          <div className="lg:flex">
            <Sidebar />
            <main className="flex-1 pb-4 md:pb-8 lg:pb-0">
              <Outlet />
            </main>
          </div>
        </div>
      </ProtectedRoute>
    );
  }