import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { BiLogoFacebook, BiLogoPinterestAlt } from "react-icons/bi";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { BsArrowRight, BsTrash3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import Details from "./Details";
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { AiFillHeart } from "react-icons/ai";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import { useWishList } from "../Context/WishListContext";
import { useCartList } from "../Context/CartListContext";



const QuickViewCard = ({ artPhoto, artWorkId, title, price, size, medium, surface, artType, creationYear, quality, delivery, description }) => {

    const [displayDetails, setDisplayDetails] = useState(true); 
    const [displayDescription, setDisplayDescription] = useState(false);
    const [ isWishList, setIsWishList ] = useState(false);
    const { wishListedNumber, updateWishListedNumber } = useWishList();
    const [ isCartList, setIsCartList ] = useState(false);
    const { cartListNumber, updatedCartListNumber } = useCartList();


    const checkIfWishListed = async () => {
      try{
        const response = await makeAuthenticatedGETRequest(
          `/wishList/checkwishlist?artWorkId=${artWorkId}`
        );
        if(response && response.data && response.data.wishListedArt && response.data.wishListedArt.includes(artWorkId)){
          setIsWishList(true);
        } else {
          setIsWishList(false);
        }
  
      } catch (error) {
        console.error("Error checking if artwork is wishlisted", error);
      }
    }
  
  
    useEffect(() => {
  
      checkIfWishListed();
    }, [artWorkId]);


  const checkIfCartListed = async () => {
    try{

      const response = await makeAuthenticatedGETRequest(
        `/cartList/checkcartlist?artWorkId=${artWorkId}`
      );
      if(response && response.data && response.data.cartListedArt && response.data.cartListedArt.includes(artWorkId)){
        setIsCartList(true);
      } else {
        setIsCartList(false);
      }

    } catch (error){
      console.error("Error checking artwork in the cartList", error);
    }
  };

  useEffect(() => {
    checkIfCartListed()
  },[artWorkId]);
  
    const addWishList = async (artWorkId) => {
      try{
  
        const response = await makeAuthenticatedPOSTRequest(
          `/wishList/addwishlist/${artWorkId}`
        );
  
        if(response.error){
          console.error("Error adding to wishlist:", response.error);
        }
        updateWishListedNumber(wishListedNumber + 1);
  
      } catch (error){
        console.error("Error adding to wishList:", error);
      }
    };
  
  
    const deleteWishList = async (artWorkId) => {
      try{
  
        const response = await makeAuthenticatedPOSTRequest(
          `/wishList/deletewishlist/${artWorkId}`
        );
  
        if(response.error){
          console.error("Error deleting artwork from wishList:", response.error)
        };
        updateWishListedNumber(wishListedNumber - 1);
  
      } catch (error){
        console.error("Error deleting the artwork from the wishlist:", error);
      }
    };
  
    const handleWishList = async () => {
      if (isWishList){
        await deleteWishList(artWorkId);
      } else {
        await addWishList(artWorkId)
      }
      setIsWishList(!isWishList)
    }


    const addCartList = async (artWorkId) => {
      try{
  
        const response = await makeAuthenticatedPOSTRequest(
          `/cartList/addcartlist/${artWorkId}`
        );
        if(response.error){
          console.error("Error adding to cart list:", response.error);
        };
  
        updatedCartListNumber(cartListNumber + 1);
  
      } catch (error) {
        console.log('Error adding to cart list', error);
      }
    };
  
  
    const deleteCartList = async (artWorkId) => {
      try{
  
        const response = await makeAuthenticatedPOSTRequest(
          `/cartList/deletecartlist/${artWorkId}`
        );
        if(response.error){
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

    const toggleDetails = () => {
        setDisplayDetails(true);
        setDisplayDescription(false);
      };
    
      const toggleDescription = () => {
        setDisplayDescription(true);
        setDisplayDetails(false);
      };

      const artPhotoFilename = artPhoto.split("\\").pop();
      const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;
  
    return(
        <section className="h-96 w-2/3">
            <div className="flex bg-white h-full w-full">
                <div className="w-1/2">
                    <img 
                       src={artPhotoUrl}
                       alt="Image of art"
                       className="h-full w-full"
                    />
                </div>
                <div className="flex flex-col p-6 h-96 w-1/2 overflow-auto">
                    <div className="flex flex-col items-start border-b-2  border-gray-300 ">
                        <p className="text-2xl font-semibold my-4">"{title}"</p>
                        <p className="text-xl text-gray-700 mb-4">{price}</p>
                    </div>
                        <div className="flex flex-col">
                            <p className="flex my-4 items-start">Shipping is calculated at checkout</p>
                            <div className="flex flex-row space-x-4">
                                <button onClick={handleCartList} className="w-4/5 bg-[#9A7B4F] text-white font-semibold px-2 py-3 rounded-3xl hover:bg-black">
                                  {isCartList ? (
                                     <Tooltip title="Remove from Cart" position="top">
                                        <BsTrash3 />
                                     </Tooltip>
                                  ) : (
                                    <p>ADD TO CART</p>
                                   )}
                                </button>
                                <button onClick={handleWishList} className="px-3 py-3 text-2xl border border-black rounded-full hover:text-[#9A7B4F] hover:border-[#9A7B4F]">
                                { isWishList ? (
                                   <Tooltip title="remove from Wishlist" position="top">
                                     <AiFillHeart  className="text-red-600 text-2xl cursor-pointer"  />
                                   </Tooltip>
                                ) : (
                                   <Tooltip title="Add to Wishlist" position="top">
                                      <CiHeart className="text-2xl hover:text-[#9A7B4F] cursor-pointer" />
                                   </Tooltip>
                                )}
                                </button>
                            </div>
                        </div>
                    
                    <div className="flex mt-10">
                    <ul className="grid grid-cols-2 w-full divide-x-4 border">
                        <li className="text-xl font-bold ">
                          <button onClick={toggleDetails}
                          className={`text-xl font-bold w-full px-3 py-3 ${displayDetails ? "bg-gray-300 " : "hover:bg-gray-200"} hover:text-white`}
                          >Details</button>
                        </li>
                        <li className="text-xl font-bold">
                          <button onClick={toggleDescription}
                            className={`text-xl font-bold w-full px-3 py-3 ${displayDescription ? "bg-gray-300" : "hover:bg-gray-200"} hover:text-white`}
                          >
                            Description
                          </button>
                        </li>
                    </ul>
                    </div>
                    <div className="p-3 border-r border-l border-b">
                    { displayDetails && (
                        <Details 
                          size={size}
                          medium={medium}
                          surface={surface}
                          artType={artType}
                          creationYear={creationYear}
                          quality={quality}
                          delivery={delivery}
                          
                           
                        />
                    )}
                    { displayDescription && (
                        <p className="flex flex-start">{description}</p>
                    )}
                    </div>
                    <div className="flex flex-row my-4 space-x-4">
                        <Link>
                           <Tooltip
                             title="Share On Facebook"
                             position="top"
                           >
                             <BiLogoFacebook className="text-xl hover:text-blue-500" />
                           </Tooltip>
                        </Link>
                        <Link>
                            <Tooltip
                              title="Share on Twitter"
                              position="top"
                            >
                           <RiTwitterXLine  className="text-xl hover:text-blue-500"/>
                           </Tooltip>
                        </Link>
                        <Link>
                           <Tooltip
                              title="Share on Email"
                              position="top"
                           >
                           <MdEmail className="text-xl hover:text-blue-500" />
                           </Tooltip>
                        </Link>
                        <Link>
                           <Tooltip
                              title="Share on Pinterest"
                              position="top"
                           >
                           <BiLogoPinterestAlt className="text-xl hover:text-blue-500" />
                           </Tooltip>
                        </Link>
                    </div>
                    <div>
                    <Link className="relative flex flex-row flex-start items-center font-bold hover:text-[#9A7B4F] cursor-pointer group transform duration-300 ease-in-out">
                       View full details
                        <BsArrowRight
                           className="transform translate-x-0 group-hover:translate-x-3 transition-transform duration-300 ease-in-out"
                        />
                    </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default QuickViewCard;