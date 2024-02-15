import React from "react";
import NavBar from "../Home/NavBar";
import { Link } from "react-router-dom";

const DashBoard = ({ children }) => {
    return (
        <section className="bg-gray-100 min-h-screen">
            <NavBar />
            <div className="container mx-auto py-6">
                <h2 className="text-center text-3xl my-6 font-bold">My Account</h2>
                <div className="flex flex-col md:flex-row md:space-x-6">
                    <div className="md:w-1/4">
                        <ul className="space-y-4">
                            <li className="text-lg font-semibold">
                                <Link to="/dashboard" className="text-gray-800 hover:text-indigo-600">
                                    Dashboard
                                </Link>
                            </li>
                            <li className="text-lg font-semibold">
                                <Link to="/address" className="text-gray-800 hover:text-indigo-600">
                                    Address
                                </Link>
                            </li>
                            <li className="text-lg font-semibold">
                                <Link to="/orders" className="text-gray-800 hover:text-indigo-600">
                                    Orders
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div className="md:w-3/4">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DashBoard;
