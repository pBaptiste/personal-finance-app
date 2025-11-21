import { Link, useLocation } from "react-router";
import HomeIcon from "~/images/icon-nav-overview.svg?react";
import TransactionIcon from "~/images/icon-nav-transactions.svg?react";
import BudgetIcon from "~/images/icon-nav-budgets.svg?react";
import PotsIcon from "~/images/icon-nav-pots.svg?react";
import BillsIcon from "~/images/icon-nav-recurring-bills.svg?react";
import logoLarge from "~/images/logo-large.svg"
import logoSmall from "~/images/logo-small.svg"
import MinimizeIcon from "~/images/icon-minimize-menu.svg?react"
import { useState } from "react";

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

const Minimize = MinimizeIcon;

export default function Sidebar() {
    const [ isMinimized, setIsMinimized ] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <aside className={`hidden lg:flex flex-col w-[300px] h-screen pb-[145px] bg-grey-900 rounded-r-2xl shrink-0 ${isMinimized && "w-auto"}`}>
            <div className="py-10 pl-8">
                <img src={isMinimized ? logoSmall : logoLarge} alt="Logo"/>
            </div>
            <nav className="flex-1 pr-6">
                <ul className="space-y-1">
                    {navItems.map(item => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 px-8 py-4 rounded-r-xl transition-colors text-preset-3 group
                                        ${isActive(item.path)
                                            ? "border-4 border-l-green text-grey-900 bg-beige-100"
                                            : "text-gray-300 hover:text-white"
                                        }
                                    `}
                                >
                                    <IconComponent
                                        className={`w-6 h-6 transition-colors ${isActive(item.path) ? "fill-green" : "fill-grey-300 group-hover:fill-white"}`}
                                        aria-label={`${item.name} icon`}
                                    />
                                    <span className={`text-preset-4 transition-colors ${isMinimized && "hidden"}`}>{item.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            <button 
                aria-label="Minimize or unminimize the sidebar menu"
                onClick={() => setIsMinimized(!isMinimized)}
                className="pl-8 flex items-center gap-4 cursor-pointer group">
                <Minimize
                    className={`w-6 h-6 fill-grey-300 group-hover:fill-white ${isMinimized && "rotate-180"}`} 
                />
                <span className={`text-preset-3 text-gray-300 group-hover:text-white ${isMinimized && "hidden"}`}>Minimize Menu</span>
            </button>
        </aside>
    );
}

