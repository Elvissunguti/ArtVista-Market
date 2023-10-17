import React from "react";
import art from "../../Assets/art Images/art 6.webp";
import { CiHeart } from "react-icons/ci";
import { AiOutlineEye } from "react-icons/ai";
import 'tippy.js/dist/tippy.css'; // Import tippy CSS
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';




const ArtCard = () => {

    return (
        <section className="group relative w-48 h-48">
            <div>
                <div>
                    <img 
                       src={art}
                       alt="image of art"
                       className="w-48 h-48"
                    />
                    <ul className="hidden group-hover:block absolute top-0 right-0 m-4 inset text-white bg-black bg-opacity-7 flex  items-end ">
                        <li className="group">
                            <Tooltip
                              title="Add to Wishlist"
                              position="left"
                            >
                            <CiHeart 
                              className="text-2xl cursor-pointer" 
                            />
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
                    <p className="hidden group-hover:block absolute inset-x-0 bottom-0 text-white h-8 bg-black bg-opacity-75 flex justify-center items-center transition-transform transform translate-y-full group-hover:translate-y-0">
                        ADD TO CARD
                        </p>
                    <div>
                        <p>"Title"</p>
                        <p>Price</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ArtCard;