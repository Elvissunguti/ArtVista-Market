import React, { useState, useEffect } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import CartListCard from "./CartListCard";
import { Link } from "react-router-dom";


const CartList = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/cartList/cartlisted");
                const items = response.data || [];
                setCartItems(items);
                setTotalPrice(response.totalPrice);
            } catch (error) {
                console.error("Error fetching the artwork in the cartlist", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section className="bg-gray-100 min-h-screen">
            <NavBar />
            <div className="max-w-2xl mx-auto mt-8 p-4 bg-white rounded-lg shadow-md">
                <div className="flex justify-center items-center my-4">
                    <p className="text-3xl font-bold">SHOPPING CART</p>
                </div>
                {loading ? (
                    <div className="min-h-screen flex justify-center overflow-none">
                        <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] border-solid rounded-full"></div>
                    </div>
                ) : (
                    <>
                        {(cartItems === null || (cartItems && cartItems.length === 0)) ? (
                            <p>Cart list is empty.</p>
                        ) : (
                            <>
                                {cartItems.map((item, index) => (
                                    <CartListCard
                                        key={index}
                                        title={item.title}
                                        artPhoto={item.artPhoto}
                                        artType={item.artType}
                                        price={item.price}
                                        userName={item.userName}
                                        artWorkId={item._id}
                                    />
                                ))}
                                <div className="flex justify-end mt-4">
                                    <p className="text-xl font-semibold">Total Price: ${totalPrice}</p>
                                </div>
                                <div className="flex justify-end my-4">
                                    <button className="bg-blue-500 text-white py-2 px-4 rounded-full">
                                        <Link to="/checkout">
                                        CHECKOUT
                                        </Link>
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
            
        </section>
    );
};

export default CartList;
