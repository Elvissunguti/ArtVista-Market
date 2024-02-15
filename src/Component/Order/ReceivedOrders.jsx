import React, { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";

const ReceivedOrder = () => {
    const [orders, setOrders] = useState([]);
    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [orderStatus, setOrderStatus] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await makeAuthenticatedGETRequest(
                "/order/receivedorder"
                );
            setOrders(response.data);
            // Initialize order status state
            const initialOrderStatus = {};
            response.data.forEach(order => {
                initialOrderStatus[order._id] = order.status;
            });
            setOrderStatus(initialOrderStatus);
        } catch (error) {
            console.error("Error fetching received orders:", error);
        }
    };

    const constructArtPhotoUrl = (artPhotoPath) => {
        const artPhotoFilename = artPhotoPath.split("/").pop();
        return `/ArtImages/${artPhotoFilename}`;
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            const response = await makeAuthenticatedPOSTRequest("/order/update", { orderId, newStatus });
            console.log("Status updated successfully:", response.data);
            // Update the order status in the local state
            setOrderStatus(prevStatus => ({
                ...prevStatus,
                [orderId]: newStatus
            }));
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            // Reset updatingOrderId after update attempt
            setUpdatingOrderId(null);
        }
    };

    return (
        <section className="p-4">
            <h2 className="text-3xl font-semibold mb-4">Received Orders</h2>
            {orders.map(order => (
                <div key={order._id} className="border border-gray-300 p-4 mb-4">
                    <h3 className="text-lg font-semibold mb-2">Order {order._id}</h3>
                    <p>Status: {orderStatus[order._id]}</p>
                    {updatingOrderId !== order._id ? (
                        <div className="mt-2">
                            <label htmlFor={`status_${order._id}`}>Update Status:</label>
                            <select
                                id={`status_${order._id}`}
                                value={orderStatus[order._id]}
                                onChange={(e) => setOrderStatus(prevStatus => ({
                                    ...prevStatus,
                                    [order._id]: e.target.value
                                }))}
                                className="mr-2"
                            >
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                            <button
                                onClick={() => {
                                    setUpdatingOrderId(order._id);
                                    handleStatusUpdate(order._id, orderStatus[order._id]);
                                }}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                Update
                            </button>
                        </div>
                    ) : (
                        <p>Updating status...</p>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {order.artworks.map((artwork, index) => (
                            <div key={index} className="border border-gray-300 p-2">
                                <img
                                    src={constructArtPhotoUrl(artwork.artPhoto[0])}
                                    alt={artwork.title}
                                    className="w-full h-auto"
                                />
                                <p className="font-semibold">{artwork.title}</p>
                                <p>${artwork.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default ReceivedOrder;
