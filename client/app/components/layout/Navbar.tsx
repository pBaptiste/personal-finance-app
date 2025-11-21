import { Link, useLocation } from "react-router";
import HomeIcon from "~/images/icon-nav-overview.svg?react";
import TransactionIcon from "~/images/icon-nav-transactions.svg?react";
import BudgetIcon from "~/images/icon-nav-budgets.svg?react";
import PotsIcon from "~/images/icon-nav-pots.svg?react";
import BillsIcon from "~/images/icon-nav-recurring-bills.svg?react";


interface NavItem {
    name: string;
    path: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
    { name: "Overview", path: "/", icon: HomeIcon },
    { name: "Transactions", path: "/transactions", icon: TransactionIcon },
    { name: "Budget", path: "/budget", icon: BudgetIcon },
    { name: "Pots", path: "/pots", icon: PotsIcon },
    { name: "Recurring Bills", path: "/recurring-bills", icon: BillsIcon },
  ];

export default function Navbar() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
      };

    return (
        <>
            {/* Mobile Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 z-10 lg:hidden bg-grey-900 rounded-t-lg pt-2 px-4 md:px-10">
                <ul className="flex justify-between items-center">
                    {
                        navItems.map(item => {
                            const IconComponent = item.icon;
                            return (
                                <li key={item.path}>
                                    <Link to={item.path} className={`text-white`}>
                                        <div className={`pt-2 pb-3 px-[22.3px] rounded-t-lg border-b-4 md:flex md:flex-col md:items-center md:gap-1 md:px-[25.5px] md:min-w-[104px] group ${isActive(item.path) ? "border-green bg-beige-100" : "border-grey-900"}`}>
                                            <IconComponent 
                                                className={`w-6 h-6 ${isActive(item.path) ? "fill-green" : "fill-grey-300 group-hover:fill-white"}`}
                                                aria-label={`${item.name} icon`}
                                            />
                                            <p className={`hidden text-preset-5-bold md:block ${isActive(item.path) ? "text-grey-900" : "text-gray-300 group-hover:text-white"}`}>{ item.name}</p>
                                        </div>
                                    </Link>
                                </li>
                            );
                        })
                    }
                </ul>
            </nav>
        </>
    )
}