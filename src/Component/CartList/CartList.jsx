import React, { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { BsTrash3 } from "react-icons/bs";
import NavBar from "../Home/NavBar";
import CartListCard from "./CartListCard";

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/cartList/cartlisted");
                setCartItems(response.data);
                setTotalPrice(response.totalPrice);
            } catch (error) {
                console.error("Error fetching the artwork in the cartlist", error);
            }
        };
        fetchData();
    }, []);



    return (
        <section>
            <NavBar />
            <div>
                <div className="flex justify-center items-center my-8 ">
                    <p className="text-3xl font-bold">SHOPPING CART</p>
                </div>
                {cartItems.map((item, index) => (
                    <CartListCard
                      title={item.title}
                      artPhoto={item.artPhoto}
                      artType={item.artType} 
                      price={item.price}
                      artWorkId={item._id}
                    
                    />
                ))}
                <div>
                    <p>Total Price: ${totalPrice}</p>
                </div>
            </div>
        </section>
    );
};

export default CartList;
