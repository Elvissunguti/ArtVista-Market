import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import ArtworkSummary from "../Shared/ArtworkSummary";
import { useEffect } from "react";
import { PayPalButton } from "react-paypal-button-v2";

const CheckOut = () => {

    const [address, setAddress ] = useState([]);
    const [orderSummary, setOrderSummary ] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("cash");
    const [paymentAmount, setPaymentAmount] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try{
                const addressResponse = await makeAuthenticatedGETRequest(
                    "/address/fetch"
                );
                setAddress(addressResponse.data);

                const orderResponse = await makeAuthenticatedGETRequest(
                    "/cartlist/cartlisted"
                );
                setOrderSummary(orderResponse.data);

            } catch(error){
                console.error("Error fetching address Information:", error);
            }
        }
        fetchData();
    }, []);




    const handlePayment = async () => {
        try {
          if (selectedPaymentMethod === 'cash') {
            processCashPayment();
          } else if (selectedPaymentMethod === 'paypal') {
            const response = await makeAuthenticatedPOSTRequest('/paypal/payment', {
              // Pass any additional data needed for PayPal payment
              amount: parseFloat(paymentAmount),
              currency: 'USD', // Adjust the currency based on your requirements
            });
      
            // After making a request to initiate PayPal payment, you may need to redirect the user to the PayPal approval URL
            window.location.href = response.data.approvalUrl;
          }
        } catch (error) {
          console.error('Error processing payment:', error);
          // Handle error appropriately
        }
      };
      
      const processCashPayment = () => {
        // Logic to handle cash payment
        console.log("Processing cash payment");
      };


    return (
        <section>
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
                        <p>Total price</p>

                    </div>
                </div>
                <div>
                    <h1>Payment</h1>
                    <div>
                        <p>please select suitable payment method:</p>
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
                            <p>Enter the amount to be paid:</p>
                            <input 
                               type="number"
                               value={paymentAmount} 
                               onChange={(e) => setPaymentAmount(e.target.value)}
                            />
              <PayPalButton
        
                onSuccess={() => console.log("Payment successful")}
                onError={(err) => console.error("Error during PayPal payment:", err)}
                options={{
                  clientId: "AU0xQdzRv2-FlVhWmF0dTgfTAvpJUvwoJ1aMMc9oRe1yXQVCvOO61mRZ7Zyv5JBxxQFxFfxOQr2lixqm", // Replace with your PayPal client ID
                }}
              />
              </div>
            )}
                              <button onClick={handlePayment}>Proceed to Payment</button>
                              <p>Shipping fees to be calculated separately</p>
             
                    </div>
                </div>

            </div>

        </section>
    )
}
export default CheckOut;