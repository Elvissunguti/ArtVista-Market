import React, { useState } from "react";
import logo from "../../Assets/art Images/art 6.webp";
import { CiHeart } from "react-icons/ci";
import { BiLogoFacebook, BiLogoPinterestAlt } from "react-icons/bi";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import Details from "./Details";
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';



const QuickViewCard = () => {

    const [displayDetails, setDisplayDetails] = useState(true); 
    const [displayDescription, setDisplayDescription] = useState(false);

    const toggleDetails = () => {
        setDisplayDetails(true);
        setDisplayDescription(false);
      };
    
      const toggleDescription = () => {
        setDisplayDescription(true);
        setDisplayDetails(false);
      };
  
    return(
        <section>
            <div className="flex h-96 w-2/3">
                <div className="w-1/2">
                    <img 
                       src={logo}
                       alt="Image of art"
                       className="h-full w-full"
                    />
                </div>
                <div className="flex flex-col p-6 h-96 w-1/2 overflow-auto">
                    <div className="flex flex-col items-start border-b-2  border-gray-300 ">
                        <p className="text-2xl font-semibold my-4">title</p>
                        <p className="text-xl text-gray-700 mb-4">price</p>
                    </div>
                        <div className="flex flex-col">
                            <p className="flex my-4 items-start">Shipping is calculated at checkout</p>
                            <div className="flex flex-row space-x-4">
                                <button className="w-4/5 bg-[#9A7B4F] text-white font-semibold px-2 py-3 rounded-3xl hover:bg-black">
                                    ADD TO CART
                                </button>
                                <button className="px-3 py-3 text-2xl border border-black rounded-full hover:text-[#9A7B4F] hover:border-[#9A7B4F]">
                                    <Tooltip title="Add To Wishlist" position="top">
                                    <CiHeart  />
                                    </Tooltip>
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
                           
                        />
                    )}
                    { displayDescription && (
                        <p className="flex flex-start">Description details</p>
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