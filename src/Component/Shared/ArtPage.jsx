import React, { useState } from "react";
import art from "../../Assets/art Images/art 8.jpg";
import { Link } from "react-router-dom";
import { BiLogoFacebook, BiLogoPinterestAlt } from "react-icons/bi";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from 'react-icons/gr';
import 'tippy.js/dist/tippy.css'; 
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';
import { CiHeart } from "react-icons/ci";
import Details from "./Details";
import art1 from "../../Assets/art Images/art 6.webp";
import art2 from "../../Assets/art Images/art 8.jpg";
import art3 from "../../Assets/art Images/art 9.webp";
import art4 from "../../Assets/art Images/art 1.jfif";


const ArtPage = () => {

    const [displayDetails, setDisplayDetails] = useState(true); 
    const [displayDescription, setDisplayDescription] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isImageHovered, setIsImageHovered] = useState(false);
    

    const toggleDetails = () => {
        setDisplayDetails(true);
        setDisplayDescription(false);
    };
    
    const toggleDescription = () => {
        setDisplayDescription(true);
        setDisplayDetails(false);
    };


      const images =[
        art,
        art2,
        art1,
        art3,
        art4
      ];

      const goToPreviousImage = () => {
        if (currentImageIndex > 0) {
          setCurrentImageIndex(currentImageIndex - 1);
        }
      };
      
      const goToNextImage = () => {
        if (currentImageIndex < images.length - 1) {
          setCurrentImageIndex(currentImageIndex + 1);
        }
      };

      const handleImageClick = (index) => {
        setCurrentImageIndex(index);
      };


    return (
        <section>
            <div className="flex justify-center max-w-7xl mx-auto">
                <div className="relative w-2/3" >
                    <div                       
                      onMouseEnter={() => setIsImageHovered(true)}
                      onMouseLeave={() => setIsImageHovered(false)}>
                    <img
                      src={images[currentImageIndex]}
                      alt="image of art"
                      className="w-full cursor-pointer"

                    />
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
                    </div>

                    <div className="flex flex-wrap ">
                        {images.map((image, index) => (
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