import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import ArtworkSummary from "../Shared/ArtworkSummary";
import { useEffect } from "react";

const CheckOut = () => {

    const [address, setAddress ] = useState([]);
    const [orderSummary, setOrderSummary ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/address/fetch"
                );
                setAddress(response.data)

            } catch(error){
                console.error("Error fetching address Information:", error);
            }
        }
        fetchData();
    });

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/cartlist/cartlisted"
                );
                setOrderSummary(response.data);

            } catch (error){
                console.error("Error fetching cartlisted artwork:", error);
            }
        }
        fetchData();
    })


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
                    </div>
                </div>

            </div>

        </section>
    )
}
export default CheckOut;