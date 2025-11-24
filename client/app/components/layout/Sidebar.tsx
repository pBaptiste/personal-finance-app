import { Link, useLocation } from "react-router";
import { motion, AnimatePresence } from "motion/react";
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
    { name: "Recurring Bills", path: "/recurring", icon: BillsIcon },
];

const Minimize = MinimizeIcon;

export default function Sidebar() {
    const [ isMinimized, setIsMinimized ] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <motion.aside
            initial={false}
            animate={{
                width: isMinimized ? 88 : 300,
            }}
            transition={{
                duration: 0.3,
                ease: "easeInOut",
            }}
            className="hidden lg:flex flex-col h-screen pb-[145px] bg-grey-900 rounded-r-2xl shrink-0 overflow-hidden"
        >
            <motion.div
                className="py-10 flex"
                animate={{
                    justifyContent: isMinimized ? "center" : "flex-start",
                    paddingLeft: isMinimized ? 0 : 32,
                }}
                transition={{ duration: 0.3 }}
            >
                <AnimatePresence mode="wait">
                    {isMinimized ? (
                        <motion.img
                            key="small"
                            src={logoSmall}
                            alt="Logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        />
                    ) : (
                        <motion.img
                            key="large"
                            src={logoLarge}
                            alt="Logo"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                        />
                    )}
                </AnimatePresence>
            </motion.div>
            <motion.nav
                className="flex-1"
                animate={{
                    paddingRight: isMinimized ? 0 : 24,
                }}
                transition={{ duration: 0.3 }}
            >
                <ul className="space-y-1">
                    {navItems.map(item => {
                        const IconComponent = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`
                                        flex items-center gap-3 py-4 rounded-r-xl transition-colors text-preset-3 group
                                        focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2
                                        ${isMinimized ? "justify-center px-0" : "px-8"}
                                        ${isActive(item.path)
                                            ? "border-4 border-l-green text-grey-900 bg-beige-100"
                                            : "text-gray-300 hover:text-white"
                                        }
                                    `}
                                >
                                    <IconComponent
                                        className={`w-6 h-6 transition-colors shrink-0 ${isActive(item.path) ? "fill-green" : "fill-grey-300 group-hover:fill-white"}`}
                                        aria-label={`${item.name} icon`}
                                    />
                                    <AnimatePresence>
                                        {!isMinimized && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="text-preset-4 transition-colors overflow-hidden whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </motion.nav>
            <motion.button
                aria-label="Minimize or unminimize the sidebar menu"
                onClick={() => setIsMinimized(!isMinimized)}
                className={`flex items-center gap-4 cursor-pointer group focus:outline-none focus-visible:outline-2 focus-visible:outline-blue focus-visible:outline-offset-2 focus-visible:rounded-lg ${isMinimized ? "justify-center px-0" : "pl-8"}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <motion.div
                    animate={{ rotate: isMinimized ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <Minimize className="w-6 h-6 fill-grey-300 group-hover:fill-white" />
                </motion.div>
                <AnimatePresence>
                    {!isMinimized && (
                        <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: "auto" }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-preset-3 text-gray-300 group-hover:text-white overflow-hidden whitespace-nowrap"
                        >
                            Minimize Menu
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.button>
        </motion.aside>
    );
}

