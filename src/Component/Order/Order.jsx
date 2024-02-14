import React, { useState } from "react";
import DashBoard from "../DashBoard/DashBoard";
import SentOrders from "./SentOrders";
import ReceivedOrders from "./ReceivedOrders";

const Order = () => {
    const [activeTab, setActiveTab] = useState("sent");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return(
        <DashBoard>
            <div>
                <ul>
                    <li>
                        <button onClick={() => handleTabChange("sent")}>Sent Orders</button>
                    </li>
                    <li>
                        <button onClick={() => handleTabChange("received")}>Received Orders</button>
                    </li>
                </ul>
                <div>
                    {activeTab === "sent" && <SentOrders />}
                    {activeTab === "received" && <ReceivedOrders />}
                </div>
            </div>
        </DashBoard>
    );
}

export default Order;
