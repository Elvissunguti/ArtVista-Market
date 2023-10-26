import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { AiOutlineEye, AiOutlineClose } from "react-icons/ai";
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { Link } from "react-router-dom";
import QuickViewCard from "./QuickViewCard";



const ArtCard = ({ price, title, artPhoto, artWorkId, size, medium, surface, artType, creationYear, quality, delivery, description }) => {

  const [isQuickViewVisible, setQuickViewVisible] = useState(false);

  const toggleQuickView = () => {
    setQuickViewVisible(!isQuickViewVisible);
  };

  const closeQuickView = () => {
    setQuickViewVisible(false);
  };

  const artPhotoFilename = artPhoto.split("\\").pop();
  const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;

    return (
        <section className="relative" >
            <div className="group relative w-48 h-48">
                <div>
                    <div className="relative w-48 h-48 overflow-hidden">
                 
                      <img 
                        src={artPhotoUrl}
                        alt="image of art"
                        className="w-48 h-48 transition-transform transform scale-100 hover:scale-110 duration-700 cursor-pointer"
                      />
                    
                    </div>
                    <ul className="hidden group-hover:block absolute top-0 right-0 m-4 inset text-black bg-white bg-opacity-7 flex  items-end ">
                        <li className="group">
                            <Tooltip
                              title="Add to Wishlist"
                              position="left"
                            >
                            <Link>
                              <CiHeart 
                                className="text-2xl hover:text-[#9A7B4F] cursor-pointer" 
                              />
                            </Link>
                            </Tooltip>
                            
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
                    <Link className="hidden group-hover:block absolute inset-x-0 bottom-0 w-full text-white h-8 bg-[#9A7B4F] hover:bg-[#80471c] bg-opacity-75 py-1 cursor-pointer flex justify-center items-center transition-transform transform translate-y-full group-hover:translate-y-0 duration-500">
                        ADD TO CARD
                        </Link>
                    <div>
                        <p>"{title}"</p>
                        <p>$ {price}</p>
                    </div>
                </div>
            </div>
            {isQuickViewVisible && (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button className="absolute top-14 right-16 text-white hover:text-[#9A7B4F] text-3xl" onClick={closeQuickView}>
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
    )
}
export default ArtCard;