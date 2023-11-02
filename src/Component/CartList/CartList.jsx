import React from "react";
import { IoTrashOutline } from "react-icons/io";
const CartList = () => {
    return (
        <section>
            <div>
                <div>
                    <p>SHOPPING CART</p>
                </div>
                <div>
                    <img />
                    <div>
                    <p>"title"</p>
                    <IoTrashOutline />
                    </div>
                    <div>
                        <p>Price</p>
                    </div>
                </div>
                <div>
                    <p>SubTotal Price</p>
                </div>
            </div>
        </section>
    )
};
export default CartList;