import React, { useState } from "react";
import DashBoard from "../DashBoard/DashBoard";
import SentOrders from "./SentOrders";
import ReceivedOrders from "./ReceivedOrders";

const Order = () => {
    const [activeTab, setActiveTab] = useState("sent");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <DashBoard>
            <div className="flex flex-col items-center">
                <div className="flex mb-4">
                    <button
                        className={`px-4 py-2 mr-2 rounded-lg focus:outline-none ${
                            activeTab === "sent"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        onClick={() => handleTabChange("sent")}
                    >
                        Sent Orders
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg focus:outline-none ${
                            activeTab === "received"
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-800"
                        }`}
                        onClick={() => handleTabChange("received")}
                    >
                        Received Orders
                    </button>
                </div>
                <div>
                    {activeTab === "sent" && <SentOrders />}
                    {activeTab === "received" && <ReceivedOrders />}
                </div>
            </div>
        </DashBoard>
    );
};

export default Order;
