import React, { useState, useEffect } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import ArtworkSummary from "../Shared/ArtworkSummary";
import { PayPalButton } from "react-paypal-button-v2";

const CheckOut = () => {
    const [address, setAddress] = useState([]);
    const [orderSummary, setOrderSummary] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
    const [totalPrice, setTotalPrice] = useState(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const addressResponse = await makeAuthenticatedGETRequest("/address/fetch");
                setAddress(addressResponse.data);

                const orderResponse = await makeAuthenticatedGETRequest("/cartlist/cartlisted");
                setOrderSummary(orderResponse.data);

                setTotalPrice(parseFloat(orderResponse.totalPrice.replace(/,/g, '')));
                console.log("total price from order summary", orderResponse.totalPrice);


               

            } catch (error) {
                console.error("Error fetching address Information:", error);
            }
        };
        fetchData();
    }, []);



    const handlePayment = async () => {
        try {
            // Extract artwork IDs from orderSummary
            const artworkIds = orderSummary.map(artwork => artwork._id).join(',');


            // Call createOrder with the updated paymentAmount
            const response = await makeAuthenticatedPOSTRequest(
                `/order/make/${artworkIds}`,
                {
                    paymentMethod: selectedPaymentMethod,
                    paymentAmount: totalPrice,
                }
            );

            // Handle success response or redirect if needed
            console.log(response);
        } catch (error) {
            console.error('Error processing payment:', error);
            // Handle error appropriately
        }
    };

    return (
        <section className="bg-gray-100">
            <NavBar />
            <div>
                <div>
                    <p>CHECKOUT</p>
                    <div>
                        <p>{address.firstName} {address.lastName}</p>
                        <p>{address.address}</p>
                        <p>{address.city}</p>
                        <p>{address.region}</p>
                        <p>{address.phoneNumber}</p>
                    </div>
                </div>
                <div className="mt-6">
                    <h1>Order Summary</h1>
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
                         <p>Total price: {totalPrice}</p>
                    </div>
                </div>
                <div>
                    <h1>Payment</h1>
                    <div>
                        <p>Please select a suitable payment method:</p>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cash"
                                onChange={() => setSelectedPaymentMethod('cash')}
                            />
                            Cash
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="paypal"
                                onChange={() => setSelectedPaymentMethod('paypal')}
                            />
                            PayPal
                        </label>

                        {selectedPaymentMethod === 'paypal' && (
                            <div>
                                
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
        createOrder: (data, actions) => {
            const formattedTotalPrice = totalPrice.replace(',', ''); // Remove commas from totalPrice
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: formattedTotalPrice,
                        currency_code: "USD",
                    },
                }],
            });
        },
        
        onApprove: async (data, actions) => {
            const order = await actions.order.capture();
            console.log("Order approved:", order);
            // You can handle the order approval here
        },
        onCancel: (data) => {
            console.log("Payment cancelled:", data);
            // You can handle the payment cancellation here
        },
        onError: (err) => {
            console.error("Error during PayPal payment:", err);
            // You can handle payment errors here
        },
    }}
/>

                            </div>
                        )}
                        <button className="px-2 py-3 bg-main" onClick={handlePayment}>Proceed to Payment</button>
                        <p>Shipping fees to be calculated separately</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CheckOut;
