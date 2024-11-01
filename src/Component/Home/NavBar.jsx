import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { AiOutlineClose, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { FaTachometerAlt, FaArtstation, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { PiHeartStraightThin } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { IoIosMenu } from "react-icons/io";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useWishList } from "../Context/WishListContext";
import { useCartList } from "../Context/CartListContext";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

function removeCookies(name, options) {
  document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${options.path || "/"}`;
}

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  
  const { wishListedNumber } = useWishList();
  const { cartListNumber } = useCartList();
  const navigate = useNavigate();
  const location = useLocation();

  const isNavLinkActive = (path) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const search = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(
          `/search/artwork?searchText=${searchText}`
          );
        const modifiedResults = response.data.map(item => {
          const artPhotoFilename = item.artPhoto.split(/[\/\\]/).pop(); 
          const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;
          return { ...item, artPhoto: artPhotoUrl };
        });
        setSearchResults(modifiedResults);
      } catch (error) {
        console.log("Error searching for artwork", error);
      }
    };
    search();
  }, [searchText]);

  const handleSearchInputChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Do you want to logout?");
    if (confirmLogout) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:8080/auth/logout", {
          method: 'POST',
          headers: {
            'Authorization': token,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          localStorage.removeItem("token");
          removeCookies("token", { path: "/" });
          navigate("/login");
          console.log("Logout successful");
        } else {
          console.error("Logout failed");
        }
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }
  };

  return (
    <section className="bg-gray-900 text-white py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="App logo" className="w-32 h-10" />
        </Link>

        <div className="hidden lg:flex items-center space-x-4 text-lg">
          <ul className="flex space-x-4 text-lg">
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/all_artwork') ? 'text-main' : ''}`}>
              <NavLink to="/all_artwork" >ALL ARTWORKS</NavLink>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/drawings') ? 'text-main' : ''}`}>
              <NavLink to="/drawings" >DRAWINGS</NavLink>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/paintings') ? 'text-main' : ''}`}>
              <Link to="/paintings">PAINTINGS</Link>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/seller_profile') ? 'text-main' : ''}`}>
              <Link to="/seller_profile">ARTISTS</Link>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/sell_artwork') ? 'text-main' : ''}`}>
              <Link to="/sell_artwork">SELL PAINTINGS</Link>
            </li>
          </ul>

          <div className="flex items-center space-x-4 text-xl">
            <div className="relative">
              <AiOutlineSearch className="cursor-pointer" onClick={() => setIsSearchOpen(!isSearchOpen)} />
            </div>

            <Link to="/wishlist" className="relative flex ">
              <PiHeartStraightThin />
              <span className="absolute -right-0 -top-2 rounded-full bg-[#9A7B4F] w-4 h-4 top right p-0 m-0 text-sm leading-tight text-center">
                {wishListedNumber}
              </span>
            </Link>

            <Link to="/cartlist" className="relative flex ">
              <AiOutlineShoppingCart />
              <span className="absolute -right-1 -top-2  rounded-full bg-[#9A7B4F] w-4 h-4 top right p-0 m-0 text-sm leading-tight text-center">
                {cartListNumber}
              </span>
            </Link>
            <div className="relative">
  <button className="focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
    <CgProfile className="text-2xl text-[#9A7B4F] hover:text-green-500 transition duration-200" />
  </button>

  {isOpen && (
    <div className="absolute top-14 right-0 z-50">
      <ul className="flex flex-col items-start bg-base-200 px-4 py-4 shadow-lg rounded-lg">
        <li className="w-full">
          <Link to="/dashboard" className="flex items-center px-3 py-2 text-gray-800 hover:bg-[#9A7B4F] hover:text-white rounded transition duration-200">
            <FaTachometerAlt className="mr-2" />
            DASHBOARD
          </Link>
        </li>
        <li className="w-full">
          <Link to="/my_artworks" className="flex items-center px-3 py-2 text-gray-800 hover:bg-[#9A7B4F] hover:text-white rounded transition duration-200">
            <FaArtstation className="mr-2" />
            MY ARTWORKS
          </Link>
        </li>
        <li className="w-full">
          <Link to="/chats" className="flex items-center px-3 py-2 text-gray-800 hover:bg-[#9A7B4F] hover:text-white rounded transition duration-200">
            <FaEnvelope className="mr-2" />
            MESSAGES
          </Link>
        </li>
        <li className="w-full">
          <button
            className="flex items-center block w-full text-left px-3 py-2 text-gray-800 hover:bg-[#9A7B4F] hover:text-white rounded transition duration-200"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-2" />
            LOGOUT
          </button>
        </li>
      </ul>
    </div>
  )}
</div>
          </div>
        </div>

        <div className="lg:hidden">
          <IoIosMenu  className="cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
        </div>

      </div>

      {isSearchOpen && (
        <div className="lg:hidden absolute z-10 text-black right-0 mt-16 top-0 px-2 py-2 bg-green-300 w-80 max-h-[80vh] h-screen overflow-y-auto scrollbar-thin">
          <div className="flex justify-between items-center mt-7">
            <p className="text-xl font-semibold">SEARCH OUR SITE</p>
            <AiOutlineClose onClick={() => setIsSearchOpen(false)} className="hover:text-red-500 cursor-pointer"/>
          </div>
          <div className="relative">
            <input
              type="text"
              name="searchText"
              id="searchText"
              placeholder="Search for artwork"
              value={searchText || ""}
              onChange={handleSearchInputChange}
              className="my-5 pr-10 pl-4 py-2 w-full border border-gray-300 focus:z-10 focus:border-[#9A7B4F] focus:outline-none focus:ring-[#9A7B4F]"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <AiOutlineSearch />
            </div>
          </div>
          <div>
            {searchResults && searchResults.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {searchResults.map((item, index) => (
                  <div key={index} className="flex flex-col items-center mb-2">
                    <Link to={`/artpage/${encodeURIComponent(item.title)}`}>
                      <img 
                        src={item.artPhoto}
                        alt="art Photo"
                        className="h-24 w-24 object-cover object-center rounded"
                      />
                      <p className="text-sm mt-2">{item.title}</p>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <h1>No Results found!</h1>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default NavBar;
