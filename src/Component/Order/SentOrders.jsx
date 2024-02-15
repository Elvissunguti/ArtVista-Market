import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const SentOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    "/order/myorders"
                    );
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

    const constructArtPhotoUrl = (artPhotoPath) => {
        const artPhotoFilename = artPhotoPath.split("\\").pop();
        return `/ArtImages/${artPhotoFilename}`;
    };

    return (
        <section className="py-8">
            <h2 className="text-3xl font-semibold mb-4">My Orders</h2>
            {loading ? (
                <div className="min-h-screen flex  justify-center overflow-none">
                    <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] border-solid rounded-full"></div>
                </div>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : orders.length === 0 ? (
                <p className="text-gray-600">You don't have any pending or incomplete orders.</p>
            ) : (
                <div>
                    {orders.map((order, index) => (
                        <div key={index} className="border-b border-gray-200 mb-8 pb-8">
                            <p className="text-lg font-semibold">Order ID: {order._id}</p>
                            <p>Total Price: ${order.totalPrice}</p>
                            <p>Payment Method: {order.paymentMethod}</p>
                            <p>Status: {order.status}</p>
                            <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
                            <h3 className="mt-4 text-lg font-semibold">Artworks</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-4">
                                {order.artworks.map((artwork, idx) => (
                                    <li key={idx} className="flex flex-col items-center">
                                        <img
                                            src={constructArtPhotoUrl(artwork.artPhoto[0])}
                                            alt={`Artwork ${idx}`}
                                            className="w-32 h-32 object-cover rounded-md mb-2"
                                        />
                                        <p className="text-lg font-semibold">{artwork.title}</p>
                                        <p className="text-gray-600">${artwork.price}</p>
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
