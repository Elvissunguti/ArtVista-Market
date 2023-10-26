import React, { useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import { AiOutlineEye } from "react-icons/ai";
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { Link } from "react-router-dom";



const ArtCard = ({ price, title, artPhoto }) => {

  const artPhotoFilename = artPhoto.split("\\").pop();
  const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;

    return (
        <section className="group relative w-48 h-48">
            <div>
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
                              className="text-2xl cursor-pointer" 
                            />
                            </Link>
                            </Tooltip>
                            
                        </li>
                        <li className="group">
                            <Tooltip
                              title="Quick View"
                              position="left"
                            >
                            <AiOutlineEye
                               className="text-2xl cursor-pointer"
                            />
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
        </section>
    )
}
export default ArtCard;