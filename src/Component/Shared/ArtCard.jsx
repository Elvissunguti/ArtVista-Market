import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { AiOutlineEye, AiOutlineClose, AiFillHeart } from "react-icons/ai";
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { Link } from "react-router-dom";
import QuickViewCard from "./QuickViewCard";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { useWishList } from "../Context/WishListContext";
import { BsTrash3 } from "react-icons/bs";
import { useCartList } from "../Context/CartListContext";

const ArtCard = ({ price, title, artPhoto, artWorkId, size, medium, surface, artType, creationYear, quality, delivery, description, isSold }) => {
  const [isQuickViewVisible, setQuickViewVisible] = useState(false);
  const [isWishList, setIsWishList] = useState(false);
  const { wishListedNumber, updateWishListedNumber } = useWishList();
  const [isCartList, setIsCartList] = useState(false);
  const { cartListNumber, updatedCartListNumber } = useCartList();

  const checkIfWishListed = async () => {
    try {
      const response = await makeAuthenticatedGETRequest(
        `/wishList/checkwishlist?artWorkId=${artWorkId}`
      );
      if (response && response.data && response.data.wishListedArt && response.data.wishListedArt.includes(artWorkId)) {
        setIsWishList(true);
      } else {
        setIsWishList(false);
      }
    } catch (error) {
      console.error("Error checking if artwork is wishlisted", error);
    }
  };

  useEffect(() => {
    checkIfWishListed();
  }, [artWorkId]);

  const addWishList = async (artWorkId) => {
    try {
      const response = await makeAuthenticatedPOSTRequest(
        `/wishList/addwishlist/${artWorkId}`
      );

      if (response.error) {
        console.error("Error adding to wishlist:", response.error);
      }
      updateWishListedNumber(wishListedNumber + 1);

    } catch (error) {
      console.error("Error adding to wishList:", error);
    }
  };

  const checkIfCartListed = async () => {
    try {
      const response = await makeAuthenticatedGETRequest(
        `/cartList/checkcartlist?artWorkId=${artWorkId}`
      );
      if (response && response.data && response.data.cartListedArt && response.data.cartListedArt.includes(artWorkId)) {
        setIsCartList(true);
      } else {
        setIsCartList(false);
      }
    } catch (error) {
      console.error("Error checking artwork in the cartList", error);
    }
  };

  useEffect(() => {
    checkIfCartListed()
  }, [artWorkId]);

  const deleteWishList = async (artWorkId) => {
    try {
      const response = await makeAuthenticatedPOSTRequest(
        `/wishList/deletewishlist/${artWorkId}`
      );

      if (response.error) {
        console.error("Error deleting artwork from wishList:", response.error)
      };
      updateWishListedNumber(wishListedNumber - 1);

    } catch (error) {
      console.error("Error deleting the artwork from the wishlist:", error);
    }
  };

  const handleWishList = async () => {
    if (isWishList) {
      await deleteWishList(artWorkId);
    } else {
      await addWishList(artWorkId);
    }
    setIsWishList(!isWishList);
  };

  const addCartList = async (artWorkId) => {
    try {
      const response = await makeAuthenticatedPOSTRequest(
        `/cartList/addcartlist/${artWorkId}`
      );
      if (response.error) {
        console.error("Error adding to cart list:", response.error);
      };

      updatedCartListNumber(cartListNumber + 1);

    } catch (error) {
      console.log('Error adding to cart list', error);
    }
  };

  const deleteCartList = async (artWorkId) => {
    try {
      const response = await makeAuthenticatedPOSTRequest(
        `/cartList/deletecartlist/${artWorkId}`
      );
      if (response.error) {
        console.error("Error deleting from cart list:", response.error);
      };

      updatedCartListNumber(cartListNumber - 1);

    } catch (error) {
      console.log('Error deleting from cart list', error);
    }
  };

  const handleCartList = async () => {
    if (isCartList) {
      await deleteCartList(artWorkId);
    } else {
      await addCartList(artWorkId);
    }
    setIsCartList(!isCartList);
  };

  const toggleQuickView = () => {
    setQuickViewVisible(!isQuickViewVisible);
  };

  const closeQuickView = () => {
    setQuickViewVisible(false);
  };

  const artPhotoFilename = artPhoto.split("\\").pop();
  const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;

  return (
        <section className="relative">
      <div className="group relative w-48 border border-gray-300 overflow-hidden rounded-md">
        <div className="relative w-48 overflow-hidden">
          <Link to={`/artpage/${encodeURIComponent(title)}`}>
            <img
              src={artPhotoUrl}
              alt="image of art"
              className="w-full h-48 transition-transform transform scale-100 hover:scale-110 duration-700 cursor-pointer"
            />
          </Link>
        </div>

        <div className=" -bottom-8 left-0 p-2 w-full bg-[#9A7B4F] bg-opacity-75">
          <p className="text-white text-lg font-semibold">{title}</p>
          <p className="text-white text-base">$ {price}</p>
        </div>

        <div>
          {isSold && (
            <p className="absolute top-0 left-0 m-2 bg-red-500 text-white p-1">SOLD</p>
          )}
        </div>

        {!isSold && (
          <ul className="hidden group-hover:block absolute top-0 right-0 m-4 inset text-black bg-white bg-opacity-7 flex items-end">
            <li className="group" onClick={handleWishList}>
              {isWishList ? (
                <Tooltip title="remove from Wishlist" position="left">
                  <AiFillHeart className="text-red-600 text-2xl cursor-pointer" />
                </Tooltip>
              ) : (
                <Tooltip title="Add to Wishlist" position="left">
                  <CiHeart className="text-2xl hover:text-[#9A7B4F] cursor-pointer" />
                </Tooltip>
              )}
            </li>
            <li className="group">
              <Tooltip
                title="Quick View"
                position="left"
              >
                <Link onClick={toggleQuickView}>
                  <AiOutlineEye
                    className="text-2xl hover:text-[#9A7B4F] cursor-pointer"
                  />
                </Link>
              </Tooltip>
            </li>
          </ul>
        )}

{!isSold && (
  <div onClick={handleCartList} className="hidden group-hover:block absolute inset-x-0 bottom-0 w-full text-white h-8 bg-[#80471c] bg-opacity-100 py-1 cursor-pointer text-center transition-transform transform translate-y-full group-hover:translate-y-0 duration-500 flex items-center justify-center">
    {isCartList ? (
      <div className="flex justify-center align-center">
      <Tooltip title="Remove from Cart" position="top">
        <BsTrash3 className="text-white font-semibold text-lg" />
      </Tooltip>
      </div>
    ) : (
      <p className="text-white font-semibold">ADD TO CART</p>
    )}
  </div>
)}

      </div>

      {isQuickViewVisible && (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button className="absolute top-6 right-6 text-white font-semibold hover:text-[#9A7B4F] text-3xl" onClick={closeQuickView}>
            <AiOutlineClose />
          </button>

          <QuickViewCard
            price={price}
            title={title}
            artPhoto={artPhoto}
            artWorkId={artWorkId}
            size={size}
            medium={medium}
            surface={surface}
            artType={artType}
            creationYear={creationYear}
            quality={quality}
            delivery={delivery}
            description={description}
          />
        </div>
      )}
    </section>
  );
};

export default ArtCard;
