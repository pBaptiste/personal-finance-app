import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout() {
    return (
        <div>
          <Navbar />
         <p>Hello World</p>
          <div className="min-h-screen bg-beige-100 lg:flex">
            <Sidebar />
            <main className="flex-1 pb-4 md:pb-8 lg:pb-0">
              <Outlet />
            </main>
          </div>
        </div>
    )
}

