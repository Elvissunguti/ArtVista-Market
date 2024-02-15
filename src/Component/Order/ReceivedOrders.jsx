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
            const response = await makeAuthenticatedGETRequest("/order/receivedorder");
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
        <section>
            <h2>Received orders</h2>
            {orders.map(order => (
                <div key={order._id}>
                    <h3>Order {order._id}</h3>
                    <p>Status: {orderStatus[order._id]}</p>
                    {/* Only show update controls when not currently updating */}
                    {updatingOrderId !== order._id ? (
                        <div>
                            <div>
                                <label htmlFor={`status_${order._id}`}>Update Status:</label>
                                <select
                                    id={`status_${order._id}`}
                                    value={orderStatus[order._id]}
                                    onChange={(e) => setOrderStatus(prevStatus => ({
                                        ...prevStatus,
                                        [order._id]: e.target.value
                                    }))}
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                                <button onClick={() => handleStatusUpdate(order._id, orderStatus[order._id])}>Update</button>
                            </div>
                        </div>
                    ) : (
                        <p>Updating status...</p>
                    )}
                    <div>
                        <h4>Artworks</h4>
                        {order.artworks.map((artwork, index) => (
                            <div key={index}>
                                <img
                                    src={constructArtPhotoUrl(artwork.artPhoto[0])}
                                    alt={artwork.title}
                                />
                                <p>Title: {artwork.title}</p>
                                <p>Price: ${artwork.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default ReceivedOrder;
