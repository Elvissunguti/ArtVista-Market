import React, { createContext, useContext, useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const CartListContext = createContext();

export function useCartList() {
   return  useContext(CartListContext)
}

export function CartListProvider({children}) {
    const [cartListNumber, setCartListNumber ] = useState(0);

    useEffect(() => {
        const fetchInitialCartListNumber = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/cartList/checkcartlistnumber"
                );
                setCartListNumber(response.data)
            } catch (error){
                console.error("Error fetching number of artwork in the cartList:", error);
            }
        }
        fetchInitialCartListNumber();
    }, [setCartListNumber]);


    const updatedCartListNumber = (newNumber) => {
        setCartListNumber(newNumber)
    }

    return (
      <CartListContext.Provider value={{ cartListNumber, updatedCartListNumber }}>
        {children}
      </CartListContext.Provider>  
    );
}
