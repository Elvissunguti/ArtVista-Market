import React from "react";
import NavBar from "../Home/NavBar";
import { Link } from "react-router-dom";

const DashBoard = ({ children}) => {
    return (
        <section className="bg-gray-100 h-screen">
            <NavBar/>
            <div>
                
                    <h2 className="text-center text-3xl my-3 font-bold">My Account</h2>
                <div className="flex flex-row w-2/5">
                    <ul className="">
                        <li>Dashboard</li>
                        <li>
                            <Link to="/address">Address</Link></li>
                        <li>Orders</li>
                    </ul>
                    <div className="w-3/5">
                        {children}
                    </div>
                </div>
                
            </div>
        </section>
    )
}
 export default DashBoard;