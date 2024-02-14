import React, { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const ReceivedOrder = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/order/receivedorder");
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching received orders:", error);
            }
        };
        fetchData();
    }, []);

    const constructArtPhotoUrl = (artPhotoPath) => {
        const artPhotoFilename = artPhotoPath.split("\\").pop();
        return `/ArtImages/${artPhotoFilename}`;
    };

    return (
        <section>
            <h2>Received orders</h2>
            {orders.map((order, index) => (
                <div key={index}>
                    <h3>Order {index + 1}</h3>
                    <p>Order ID: {order._id}</p>
                    <p>Status: {order.status}</p>
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
