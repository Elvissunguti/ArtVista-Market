import React, { useState } from "react";
import logo from "../../Assets/art Images/art 6.webp";
import { CiHeart } from "react-icons/ci";
import { BiLogoFacebook, BiLogoPinterestAlt } from "react-icons/bi";
import { RiTwitterXLine } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";
import Details from "./Details";



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
                <div className="h-96 w-1/2 overflow-auto">
                    <div>
                        <p>title</p>
                        <p>price</p>
                        <div>
                            <p>Shipping is calculated at checkout</p>
                            <div>
                                <button>
                                    ADD TO CART
                                </button>
                                <button>
                                    <CiHeart  />
                                </button>
                            </div>
                        </div>
                    </div>
                    <ul>
                        <li>
                          <button onClick={toggleDetails}>Details</button>
                        </li>
                        <li>
                          <button onClick={toggleDescription}>Description</button>
                        </li>
                    </ul>
                    { displayDetails && (
                        <Details 
                           
                        />
                    )}
                    { displayDescription && (
                        <p>Description details</p>
                    )}
                    <div>
                        <Link>
                           <BiLogoFacebook />
                        </Link>
                        <Link>
                           <RiTwitterXLine />
                        </Link>
                        <Link>
                           <MdEmail />
                        </Link>
                        <Link>
                            <BiLogoPinterestAlt />
                        </Link>
                    </div>
                    <div>
                    <Link className="relative flex justify-center align-center hover:text-[#9A7B4F] cursor-pointer group transform duration-300 ease-in-out">
    View full details{" "}
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