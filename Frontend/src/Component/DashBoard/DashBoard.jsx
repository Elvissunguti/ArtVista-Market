import React from "react";
import NavBar from "../Home/NavBar";
import { Link } from "react-router-dom";

const DashBoard = ({ children }) => {
    return (
        <section className="bg-gray-50 min-h-screen">
            <NavBar />
            <div className="container mx-auto py-10">
                <h2 className="text-center text-4xl font-bold text-neutral mb-8">My Account</h2>
                <div className="flex flex-col text-white md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-1/4 bg-base-100 rounded-lg p-6 shadow-md">
                        {/* Dashboard Heading */}
                        <h3 className="text-2xl font-bold text-main mb-4">Dashboard</h3>
                        
                        {/* Other Links */}
                        <ul className="space-y-4">
                            {[
                                { path: "/address", label: "Address" },
                                { path: "/orders", label: "Orders" }
                            ].map(({ path, label }) => (
                                <li key={path}>
                                    <Link
                                        to={path}
                                        className="block text-lg font-medium text-white hover:text-[#9A7B4F] hover:bg-gray-200 rounded-lg px-4 py-2 transition duration-200"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main Content */}
                    <main className="md:w-3/4 bg-base-100 rounded-lg p-8 shadow-lg">
                        {children}
                    </main>
                </div>
            </div>
            
        </section>
    );
};

export default DashBoard;
