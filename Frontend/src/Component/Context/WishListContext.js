import React, { createContext, useContext, useEffect, useState } from 'react';
import { makeAuthenticatedGETRequest } from '../Utils/Helpers';

const WishListContext = createContext();

export function useWishList() {
  return useContext(WishListContext);
}

export function WishListProvider({ children }) {
  const [wishListedNumber, setWishListedNumber] = useState(0);

  useEffect(() => {
    const fetchInitialWishListNumber = async () => {
      try {
        const response = await makeAuthenticatedGETRequest('/wishList/checkwishlistnumber');
        setWishListedNumber(response.data);
      } catch (error) {
        console.error('Error fetching initial wishList number', error);
      }
    };
    fetchInitialWishListNumber();
  }, [setWishListedNumber]);

  const updateWishListedNumber = (newNumber) => {
    setWishListedNumber(newNumber);
  };

  return (
    <WishListContext.Provider value={{ wishListedNumber, updateWishListedNumber }}>
      {children}
    </WishListContext.Provider>
  );
}
