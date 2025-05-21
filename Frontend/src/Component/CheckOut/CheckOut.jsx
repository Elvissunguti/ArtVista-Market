import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import ArtworkSummary from "../Shared/ArtworkSummary";
import { PayPalButton } from "react-paypal-button-v2";

const CheckOut = () => {
    const [address, setAddress] = useState(null);
    const [orderSummary, setOrderSummary] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const addressResponse = await makeAuthenticatedGETRequest("/address/fetch");
                setAddress(addressResponse.data);

                const orderResponse = await makeAuthenticatedGETRequest("/cartlist/cartlisted");
                setOrderSummary(orderResponse.data);
                setTotalPrice(parseFloat(orderResponse.totalPrice.replace(/,/g, '')));
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handlePayment = async () => {
        if (!address) {
            navigate("/address/edit");
            return;
        }

        try {
            const artworkIds = orderSummary.map(artwork => artwork._id).join(',');
            const response = await makeAuthenticatedPOSTRequest(`/order/make/${artworkIds}`, {
                paymentMethod: selectedPaymentMethod,
                paymentAmount: totalPrice,
            });

            console.log("Order Response:", response);

            if (response?.orderId) {
                setOrderId(response.orderId);
                setShowSuccessModal(true);
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-xl font-semibold">Loading address and order data...</div>
            </div>
        );
    }

    if (!address) {
        return (
            <div className="modal modal-open">
                <div className="modal-box">
                    <h2 className="font-bold text-lg">Address Required</h2>
                    <p className="py-4">You need to save your address before proceeding to checkout.</p>
                    <div className="modal-action">
                        <button className="bg-[#9A7B4F] hover:bg-[#7A613A] text-white px-4 py-2 rounded" onClick={() => navigate("/address/edit")}>
                            Go to Address
                        </button>
                        <button className="btn btn-ghost" onClick={() => navigate("/cartlist")}>
                            Back to Cart
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="bg-gray-50 text-black min-h-screen">
            <NavBar />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-4">Checkout</h1>

                {/* Address Section */}
                <div className="card w-full bg-white shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-2">Shipping Address</h2>
                    <div>
                        <p className=" font-medium">{address.firstName} {address.lastName}</p>
                        <p className="">{address.address}, {address.city}</p>
                        <p className="">{address.region}</p>
                        <p className="">{address.phoneNumber}</p>
                    </div>
                </div>

                {/* Order Summary Section */}
                <div className="card w-full bg-white shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-2">Order Summary</h2>
                    <div>
                        {orderSummary.map((artwork) => (
                            <ArtworkSummary
                                key={artwork._id}
                                title={artwork.title}
                                price={artwork.price}
                                artPhoto={artwork.artPhoto}
                                artType={artwork.artType}
                            />
                        ))}
                        <p className="font-bold text-xl mt-4">Total Price: ${totalPrice}</p>
                    </div>
                </div>

                {/* Payment Method Section */}
                <div className="card w-full bg-white shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2">Payment</h2>
                    <p className="text-gray-600 mb-4">Select a payment method:</p>
                    <div className="flex items-center gap-4 mb-4">
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                className="radio radio-primary"
                                onChange={() => setSelectedPaymentMethod('cash')}
                                checked={selectedPaymentMethod === 'cash'}
                            />
                            <span className="ml-2">Cash</span>
                        </label>
                        <label className="cursor-pointer">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                className="radio radio-primary"
                                onChange={() => setSelectedPaymentMethod('paypal')}
                                checked={selectedPaymentMethod === 'paypal'}
                            />
                            <span className="ml-2">PayPal</span>
                        </label>
                    </div>

                    {selectedPaymentMethod === 'paypal' && (
                        <div className="mt-4">
                            <PayPalButton
                                amount={totalPrice}
                                onSuccess={(details, data) => {
                                    console.log("Payment successful", details);
                                    handlePayment();
                                }}
                                onError={(err) => console.error("Error during PayPal payment:", err)}
                                onCancel={() => console.log("Payment cancelled")}
                                options={{
                                    clientId: "AU0xQdzRv2-FlVhWmF0dTgfTAvpJUvwoJ1aMMc9oRe1yXQVCvOO61mRZ7Zyv5JBxxQFxFfxOQr2lixqm", 
                                    currency: "USD",
                                    style: {
                                        color: "gold",
                                        shape: "rect",
                                        label: "checkout",
                                        height: 40,
                                    },
                                }}
                            />
                        </div>
                    )}
                    <button className="btn bg-main text-white w-full mt-4" onClick={handlePayment}>
                        Proceed to Payment
                    </button>
                    <p className="text-red-500 mt-2">Shipping fees will be calculated separately.</p>
                </div>
            </div>

            {/* ✅ Success Modal */}
            {showSuccessModal && (
                <div className="modal modal-open">
                    <div className="modal-box border border-green-500">
                        <h2 className="font-bold text-lg text-green-700">✅ Order Placed Successfully!</h2>
                        <p className="py-4 text-white">Your order has been placed. You can view your order details below:</p>
                        <a
                            href={`/order/${orderId}`}
                            className="text-blue-600 underline hover:text-blue-800 font-semibold"
                        >
                            View Your Order
                        </a>
                        <div className="modal-action mt-4">
                            <button className="btn btn-primary" onClick={() => navigate(`/order/${orderId}`)}>
                                Go to Order
                            </button>
                            <button className="btn btn-ghost text-white" onClick={() => setShowSuccessModal(false)}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default CheckOut;
