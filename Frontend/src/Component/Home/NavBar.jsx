import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { AiOutlineClose, AiOutlineShoppingCart } from "react-icons/ai";
import { FaTachometerAlt, FaArtstation, FaEnvelope, FaSignOutAlt } from 'react-icons/fa';
import { PiHeartStraightThin } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { IoIosMenu } from "react-icons/io";
import { HiX } from 'react-icons/hi';
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useWishList } from "../Context/WishListContext";
import { useCartList } from "../Context/CartListContext";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { useAuth } from "../Context/AuthContext";



const NavBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  
  const { wishListedNumber } = useWishList();
  const { cartListNumber } = useCartList();
  const {  handleLogout } = useAuth();
  const navigation = useNavigate();
  const location = useLocation();

  const isNavLinkActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsNavbarFixed(currentScrollPos > 50);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const search = async () => {
      try {
        const response = await makeAuthenticatedGETRequest(`/search/artwork?searchText=${searchText}`);
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


  const handleLogoutClick = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (confirmed) {
        handleLogout();
        navigation("/Blog");
    }
};

  return (
    <section
      className={`${
        isNavbarFixed ? "fixed top-0 left-0 right-0 z-50" : "relative"
      } bg-gray-900 text-white py-3 transition-all duration-300`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/">
          <img src={logo} alt="App logo" className="w-32 h-10" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center space-x-4 text-lg">
          <ul className="flex space-x-4 text-lg">
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/all_artwork') ? 'text-main' : ''}`}>
              <NavLink to="/all_artwork">ALL ARTWORKS</NavLink>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/drawings') ? 'text-main' : ''}`}>
              <NavLink to="/drawings">DRAWINGS</NavLink>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/paintings') ? 'text-main' : ''}`}>
              <Link to="/paintings">PAINTINGS</Link>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/seller_profile') ? 'text-main' : ''}`}>
              <Link to="/seller_profile">ARTISTS</Link>
            </li>
            <li className={`hover:text-[#9A7B4F] ${isNavLinkActive('/sell_artwork') ? 'text-main' : ''}`}>
              <Link to="/sell_artwork">SELL PAINTINGS</Link></li>
            </ul>

          <div className="flex items-center space-x-4 text-xl">
            
            <Link to="/wishlist" className="relative flex">
              <PiHeartStraightThin />
              <span className="absolute -right-0 -top-2 rounded-full bg-[#9A7B4F] w-4 h-4 text-sm text-center">
                {wishListedNumber}
              </span>
            </Link>
            <Link to="/cartlist" className="relative flex">
              <AiOutlineShoppingCart />
              <span className="absolute -right-1 -top-2 rounded-full bg-[#9A7B4F] w-4 h-4 text-sm text-center">
                {cartListNumber}
              </span>
            </Link>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}>
                <CgProfile className="text-2xl text-[#9A7B4F] hover:text-green-500 transition duration-200" />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute top-14 right-0 z-50 bg-base-200 px-4 py-4 shadow-lg rounded-lg">
                  <ul className="flex flex-col items-start">
                    <li className="w-full">
                      <Link to="/address" className="flex items-center px-3 py-2 text-gray-800 hover:bg-[#9A7B4F] hover:text-white rounded transition duration-200">
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
                      <button onClick={handleLogoutClick} className="flex items-center w-full text-left px-3 py-2 text-gray-800 hover:bg-[#9A7B4F] hover:text-white rounded transition duration-200">
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

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden">
          <IoIosMenu className="cursor-pointer" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-10 bg-gray-800 bg-opacity-90 backdrop-blur-sm p-6 transform transition-transform duration-300 ease-out animate-slide-down">

    {/* Close Button */}
    <button 
      onClick={() => setIsMobileMenuOpen(false)} 
      className="absolute top-4 right-4 text-white text-3xl">
      <HiX />
    </button>

    <ul className="space-y-6">
      {/* Navigation Links */}
      <li>
        <NavLink 
          to="/all_artwork" 
          className="text-white hover:text-[#9A7B4F] transition-all duration-200 ease-in-out">ALL ARTWORKS</NavLink>
      </li>
      <li>
        <NavLink 
          to="/drawings" 
          className="text-white hover:text-[#9A7B4F] transition-all duration-200 ease-in-out">DRAWINGS</NavLink>
      </li>
      <li>
        <NavLink 
          to="/paintings" 
          className="text-white hover:text-[#9A7B4F] transition-all duration-200 ease-in-out">PAINTINGS</NavLink>
      </li>
      <li>
        <NavLink 
          to="/seller_profile" 
          className="text-white hover:text-[#9A7B4F] transition-all duration-200 ease-in-out">ARTISTS</NavLink>
      </li>
      <li>
        <NavLink 
          to="/sell_artwork" 
          className="text-white hover:text-[#9A7B4F] transition-all duration-200 ease-in-out">SELL PAINTINGS</NavLink>
      </li>

      {/* Profile Dropdown for Mobile */}
      <li className="relative">
        <button 
          onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)} 
          className="text-white flex items-center space-x-2 hover:text-[#9A7B4F] transition-all duration-200 ease-in-out">
          <CgProfile className="inline-block text-2xl" />
          <span>PROFILE</span>
        </button>
        {isProfileDropdownOpen && (
          <div className="absolute top-10 left-0 bg-gray-700 w-full p-4 rounded-xl shadow-lg z-20">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/address" 
                  className="block px-4 py-2 text-white hover:bg-[#9A7B4F] rounded-lg transition-all duration-200 ease-in-out">
                  DASHBOARD
                </Link>
              </li>
              <li>
                <Link 
                  to="/my_artworks" 
                  className="block px-4 py-2 text-white hover:bg-[#9A7B4F] rounded-lg transition-all duration-200 ease-in-out">
                  MY ARTWORKS
                </Link>
              </li>
              <li>
                <Link 
                  to="/chats" 
                  className="block px-4 py-2 text-white hover:bg-[#9A7B4F] rounded-lg transition-all duration-200 ease-in-out">
                  MESSAGES
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleLogoutClick} 
                  className="block w-full px-4 py-2 text-white hover:bg-[#9A7B4F] rounded-lg transition-all duration-200 ease-in-out">
                  LOGOUT
                </button>
              </li>
            </ul>
          </div>
        )}
      </li>
    </ul>
  </div>
)}


      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="absolute z-20 top-0 left-0 right-0 bg-black bg-opacity-50">
          <div className="relative p-5">
            <AiOutlineClose className="absolute top-0 right-0 text-white cursor-pointer" onClick={() => setIsSearchOpen(false)} />
            <input
              type="text"
              placeholder="Search artworks..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full p-3 rounded bg-white text-gray-700"
            />
            {/* Render searchResults if needed */}
          </div>
        </div>
      )}
    </section>
  );
};

export default NavBar;
