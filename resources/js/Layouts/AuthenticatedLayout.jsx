import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import CurrencyConverter from "@/Components/CurrencyConverter";
import { Toaster } from "react-hot-toast";
import { capitalize } from '../utils/helpers'; 

export default function AuthenticatedLayout({ header, children }) {
    const { auth: { user } } = usePage().props; // Destructuration pour accéder à l'utilisateur
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Liste des liens pour simplifier le JSX
    const links = [
        { href: route("dashboard"), label: "Tableau de bord", active: route().current("dashboard") },
        { href: route("courses.index"), label: "Formations", active: route().current("courses.index") },
        { href: route("bots.index"), label: "Bots", active: route().current("bots.index") },
        { 
            href: route("network.show", { userId: user.id }), 
            label: "Réseau", 
            active: route().current("network.show") 
        },
        { href: route("transactions.index"), label: "Transactions", active: route().current("transactions.index") },
        ...(user.role === "admin" 
            ? [{ href: route("users.index"), label: "Utilisateurs", active: route().current("users.index") }] 
            : []),
    ];

    return (
        <div className="min-h-screen bg-gray-100 pb-12">
            <nav className="border-b border-gray-100 bg-white">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo */}
                        <div className="flex">
                            <Link href="/" className="flex shrink-0 items-center mt-6 mb-6">
                                <ApplicationLogo className="block h-6 w-4 fill-current text-gray-800" />
                            </Link>
                            {/* Navigation Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {links.map((link, index) => (
                                    <NavLink key={index} href={link.href} active={link.active}>
                                        {link.label}
                                    </NavLink>
                                ))}
                            </div>
                        </div>

                        {/* User Dropdown */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium text-gray-500 transition duration-150 hover:text-gray-700 focus:outline-none"
                                    >
                                        <img src="/img/user.png" alt="User" className="h-6 w-6 rounded-full" />
                                        <span className="ms-2">{capitalize(user.username)}</span>
                                        <svg className="ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route("profile.edit")}>Profil</Dropdown.Link>
                                    <Dropdown.Link href={route("logout")} method="post" as="button">
                                        Se déconnecter
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path
                                        className={showingNavigationDropdown ? "hidden" : "block"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? "block" : "hidden"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Dropdown */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            {links.map((link, index) => (
                                <ResponsiveNavLink key={index} href={link.href} active={link.active}>
                                    {link.label}
                                </ResponsiveNavLink>
                            ))}
                        </div>
                        <div className="border-t border-gray-200 pb-1 pt-4 px-4">
                            <div className="text-base font-medium text-gray-800">{user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{user.email}</div>
                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route("profile.edit")}>Profil</ResponsiveNavLink>
                                <ResponsiveNavLink href={route("logout")} method="post" as="button">
                                    Se déconnecter
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                )}
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>
                {children}
                <CurrencyConverter />
                <Toaster position="top-center" reverseOrder={false} />
            </main>
        </div>
    );
}
