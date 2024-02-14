import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const SentOrder = () => {

    const [ order, setOrder ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/order/myorders"
                );
                setOrder(response.data)

            } catch(error){
                console.error("Error fetching ordered artwork:", error)
            }

        } 
        fetchData();
    }, []);


    const constructArtPhotoUrl = (artPhotoPath) => {
        const artPhotoFilename = artPhotoPath.split("\\").pop();
        return `/ArtImages/${artPhotoFilename}`;
    };

    
    return (
        <section>
            <h2>My Orders</h2>
            <div>
                {
                    order.length === 0 ? (
                        <p>You don't have any pending or incomplete orders.</p>
                    ) : (
                        order.map((order, index) => (
                            <div key={index}>
                                <p>OrderId : {order._id}</p>
                                <p>Total price: {order.totalPrice}</p>
                                <p>Payment method: {order.paymentMethod}</p>
                                <p>Status : {order.status}</p>
                                <p>Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
                                <h3>Artworks</h3>
                                <ul>
                                    {order.artworks.map((artwork, idx) => (
                                        <li>
                                            <img 
                                                src={constructArtPhotoUrl(artwork.artPhoto[0])}
                                                alt={`Artwork ${idx}`}
                                                className=""
                                            />
                                            <p>{artwork.title}</p>
                                            <p>{artwork.price}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))

                    )
                }
            </div>
        </section>
    )
}

export default SentOrder;