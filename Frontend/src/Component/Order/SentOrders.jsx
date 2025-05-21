import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const SentOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/order/myorders");
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching ordered artwork:", error);
                setError("Error fetching data. Please try again later.");
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section className="py-12 px-4 bg-gray-50 min-h-screen">
            <h2 className="text-4xl font-bold text-center text-[#9A7B4F] mb-10">My Orders</h2>
            {loading ? (
                <div className="flex justify-center items-center min-h-[300px]">
                    <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] rounded-full"></div>
                </div>
            ) : error ? (
                <p className="text-red-600 text-center font-semibold">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-gray-600 text-center">You don't have any pending or incomplete orders.</p>
            ) : (
                <div className="space-y-8">
                    {orders.map((order, index) => (
                        <div key={index} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                            <p className="text-xl font-semibold text-[#9A7B4F] mb-4">Order ID: {order._id}</p>
                            <p className="text-gray-700"><span className="font-medium">Total Price:</span> ${order.totalPrice}</p>
                            <p className="text-gray-700"><span className="font-medium">Payment Method:</span> {order.paymentMethod}</p>
                            <p className="text-gray-700"><span className="font-medium">Status:</span> {order.status}</p>
                            <p className="text-gray-700"><span className="font-medium">Ordered At:</span> {new Date(order.createdAt).toLocaleString()}</p>
                            <h3 className="mt-6 text-lg font-semibold text-[#9A7B4F]">Artworks</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                                {order.artworks.map((artwork, idx) => (
                                    <li key={idx} className="card bg-gray-100 shadow-md hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center rounded-lg">
                                        <figure className="mb-3">
                                            <img
                                                src={artwork.artPhoto[0]}
                                                alt={`Artwork ${idx}`}
                                                className="w-32 h-32 object-cover rounded-md"
                                            />
                                        </figure>
                                        <p className="text-lg font-semibold text-gray-800">{artwork.title}</p>
                                        <p className="text-[#9A7B4F] font-semibold">${artwork.price}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default SentOrder;
