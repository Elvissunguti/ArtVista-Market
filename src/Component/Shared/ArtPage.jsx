import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BiLogoFacebook, BiLogoPinterestAlt } from "react-icons/bi";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css'; 
import { CiHeart } from "react-icons/ci";
import Details from "./Details";
import Magnifier from "react-magnifier";
import "../../App.css";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import { BsTrash3 } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { useCartList } from "../Context/CartListContext";
import { useWishList } from "../Context/WishListContext";

const ArtPage = () => {

    const [displayDetails, setDisplayDetails] = useState(true); 
    const [displayDescription, setDisplayDescription] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageHovered, setIsImageHovered] = useState(false);
    const [ artWorkData, setArtWorkData ] = useState(null);
    const [ isWishList, setIsWishList ] = useState(false);
    const { wishListedNumber, updateWishListedNumber } = useWishList();
    const [ isCartList, setIsCartList ] = useState(false);
    const { cartListNumber, updatedCartListNumber } = useCartList();

    const { title } = useParams();    

    useEffect(() => {
      const fetchArt = async () => {
        try {
          const response = await makeAuthenticatedGETRequest(
            `/artwork/get/artwork/${title}`
          );
                // Map artPhoto array to create artPhotoUrl values
            const artWorkDataWithUrls = {
              ...response.data,
              artWorkId: response.data._id,
              artPhoto: response.data.artPhoto.map((artPhoto) => {
              const artPhotoFilename = artPhoto.split("\\").pop();
              return `/ArtImages/${artPhotoFilename}`;
              }),
            };

          setArtWorkData(artWorkDataWithUrls);
        
        } catch (error) {
          console.error("Error fetching artwork data:", error);
        }
      }
      fetchArt();
    }, [title]);

    const artWorkId = artWorkData?.artWorkId;


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
        await addWishList(artWorkId);
      }
      setIsWishList(!isWishList);
    };
  
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


      const goToPreviousImage = () => {
        if (currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        }
      };
      
      const goToNextImage = () => {
        if (currentImageIndex < artWorkData?.artPhoto.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      };

      const handleImageClick = (index) => {
        setCurrentImageIndex(index);
      };


    return (
        <section>
          <NavBar />
            <div className="flex justify-center mt-8 max-w-7xl mx-auto">
                <div className="relative w-2/3" >
                    <div                       
                      onMouseEnter={() => setIsImageHovered(true)}
                      onMouseLeave={() => setIsImageHovered(false)}>
                      <Magnifier
                        src={artWorkData?.artPhoto[currentImageIndex]}
                        alt="Image of art"
                        width={600}
                        mgWidth={200}
                        mgHeight={200}
                      />
                    </div>
                    {isImageHovered && (
                      <div className="absolute inset-0 flex items-center justify-between">
                        <button className="text-xl border border-black cursor-pointer" onClick={goToPreviousImage}>
                          <GrFormPrevious />
                        </button>
                        <button className="text-xl border border-black cursor-pointer" onClick={goToNextImage}>
                          <GrFormNext />
                        </button>
                      </div>
                    )}
                    

                    <div className="flex flex-wrap ">
                        {artWorkData?.artPhoto.map((image, index) => (
                            <div className="m-4" key={index}>
                            <img 
                               src={image}
                               alt="image of art"
                               onClick={() => handleImageClick(index)}
                               className="w-48 h-32 cursor-pointer"
                            />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col p-6 w-1/3">
                    <div className="flex flex-col items-start border-b-2  border-gray-300 ">
                        <p className="text-2xl font-semibold my-4">{artWorkData?.title}</p>
                        <p className="text-xl text-gray-700 mb-4">{artWorkData?.price}</p>
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
                                  <Tooltip title="remove from Wishlist" position="left">
                                     <AiFillHeart  className="text-red-600 text-2xl cursor-pointer"  />
                                  </Tooltip>
                                 ) : (
                                  <Tooltip title="Add to Wishlist" position="left">
                                     <CiHeart className="text-2xl hover:text-[#9A7B4F] cursor-pointer" />
                                  </Tooltip>
                                )}
                                </button>
                            </div>
                            <div>
                              <button className="w-full mt-4 bg-[#9A7B4F] text-white font-semibold px-2 py-3 rounded-3xl hover:bg-black">
                                Chat With Artist
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
                           size={artWorkData?.size}
                           surface={artWorkData?.surface}
                           medium={artWorkData?.medium}
                           delivery={artWorkData?.delivery}
                           artType={artWorkData?.artType}
                           quality={artWorkData?.quality}
                           creationYear={artWorkData?.creationYear}
                           
                        />
                    )}
                    { displayDescription && (
                        <p className="flex flex-start">{artWorkData.description}</p>
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
                </div>
            </div>
            <div>
                    <div>
                        <h1>You may also like</h1>
                    </div>
                </div>
        </section>
    )
}
export default ArtPage;