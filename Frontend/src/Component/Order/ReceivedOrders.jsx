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
            setOrderStatus(prevStatus => ({
                ...prevStatus,
                [orderId]: newStatus
            }));
        } catch (error) {
            console.error("Error updating order status:", error);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    return (
        <section className="p-8 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-bold text-center text-[#9A7B4F] mb-8">Received Orders</h2>
            {orders.map(order => (
                <div key={order._id} className="bg-white shadow-lg rounded-lg p-6 mb-6 border border-gray-200">
                    <h3 className="text-2xl font-semibold mb-4 text-[#9A7B4F]">Order #{order._id}</h3>
                    <p className="text-gray-700 mb-4"><span className="font-medium">Status:</span> {orderStatus[order._id]}</p>
                    
                    {updatingOrderId !== order._id ? (
                        <div className="flex items-center space-x-4">
                            <select
                                value={orderStatus[order._id]}
                                onChange={(e) => setOrderStatus(prevStatus => ({
                                    ...prevStatus,
                                    [order._id]: e.target.value
                                }))}
                                className="select select-bordered w-full max-w-xs text-gray-700"
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
                                className="btn px-6 py-2 text-white font-semibold rounded-md"
                                style={{ backgroundColor: '#9A7B4F', hover: { backgroundColor: '#7F5F3D' } }}
                            >
                                Update Status
                            </button>
                        </div>
                    ) : (
                        <p className="text-[#9A7B4F] font-semibold">Updating status...</p>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                        {order.artworks.map((artwork, index) => (
                            <div key={index} className="card bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300">
                                <figure className="px-6 pt-6">
                                    <img
                                        src={constructArtPhotoUrl(artwork.artPhoto[0])}
                                        alt={artwork.title}
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                </figure>
                                <div className="card-body p-4">
                                    <h2 className="card-title text-lg font-semibold text-gray-800">{artwork.title}</h2>
                                    <p className="text-[#9A7B4F] font-semibold">${artwork.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default ReceivedOrder;
