import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";

const OrderedDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(`/order/fetch/${orderId}`);
                setOrder(response.order);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (loading) {
        return <div className="text-center mt-10 text-lg font-semibold">Loading order details...</div>;
    }

    if (!order) {
        return <div className="text-center mt-10 text-red-600">Order not found.</div>;
    }

    return (
        <section className="min-h-screen bg-gray-50">
            <NavBar />
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">Order #{order._id}</h1>

                {/* Order Info */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4 text-[#9A7B4F]">Order Summary</h2>
                    <p><strong>Status:</strong> {order.status}</p>
                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    <p><strong>Total Price:</strong> ${order.totalPrice}</p>
                </div>

                {/* Artworks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {order.artworks.map((item, idx) => (
                        <div key={idx} className="bg-white rounded shadow p-4">
                            <img
                                src={item.artwork?.artPhoto?.[0]}
                                alt={item.artwork?.title}
                                className="h-48 w-full object-cover rounded mb-4"
                            />
                            <h3 className="text-lg font-semibold">{item.artwork?.title}</h3>
                            <p className="text-[#9A7B4F]">${item.artwork?.price}</p>
                            {item.artistId && (
                                <p className="text-gray-600 mt-1">
                                    Artist: {item.artistId.firstName} {item.artistId.lastName}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-8">
                    <button className="btn bg-main text-white" onClick={() => navigate("/")}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </section>
    );
};

export default OrderedDetails;
