import React from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { PiHeartStraightThin } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";


const NavBar = () => {
    return (
        <section>
            <div className="flex flex-row justify-between">
                <div>
                    <img 
                       src={logo}
                       alt="App logo"
                       className="w-32 h-10"
                    />
                </div>
                <div className="flex flex-row">
                    <ul className="flex flex-row space-x-4 text-xl">
                        <li>ALL ARTWORKS</li>
                        <li>PAITINGS</li>
                        <li>DRAWINGS</li>
                        <li>ARTISTS</li>
                        <li>SELL PAINTINGS</li>
                    </ul>
                </div>
                <div className="flex flex-row space-x-4 text-2xl">
                    <AiOutlineSearch />
                    <Link className="relative flex">
                        <PiHeartStraightThin  />
                        <span className="absolute right-0 top-0 rounded-full bg-blue-200 w-4 h-4 top right p-0 m-0 text-sm leading-tight text-center">
                            1
                        </span>
                    </Link>
                    <Link className="relative flex">
                        <AiOutlineShoppingCart />
                        <span className="absolute right-0 top-0 rounded-full bg-blue-200 w-4 h-4 top right p-0 m-0 text-sm leading-tight text-center">
                            5
                        </span>
                    </Link>
                    <div>
                        <CgProfile />
                    </div>
                </div>

            </div>
        </section>
    )
}

export default NavBar;