import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { AiOutlineClose, AiOutlineSearch, AiOutlineShoppingCart } from "react-icons/ai";
import { PiHeartStraightThin } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { Link } from "react-router-dom";
import { useWishList } from "../Context/WishListContext";
import { useCartList } from "../Context/CartListContext";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";


const NavBar = () => {

    const [ isOpen, setIsOpen ] = useState(false);
    const [ isSearchOpen, setIsSearchOpen ] = useState(false);
    const { wishListedNumber } = useWishList();
    const { cartListNumber } = useCartList();
    const [ searchText, setSearchText ] = useState(null);
    const [ searchResults, setSearchResults ] = useState([]);
    

    useEffect(() => {
        const search = async() => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    `/search/artwork?searchText=${searchText}`
                );
                const modifiedResults = response.data.map(item => {
                const artPhotoFilename = item.artPhoto.split("/").pop(); 
                const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;
                return { ...item, artPhoto: artPhotoUrl };
                 });

            setSearchResults(modifiedResults);
            } catch (error){
                console.log("Error searching for artwork", error);
            }
        } 
        search();
    }, [searchText]);

    const handleSearchInputChange = (event) => {
        setSearchText(event.target.value);
    };

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
                        <li>
                            <Link to="/all artwork" className="cursor-pointer">ALL ARTWORKS</Link>
                            </li>
                        <li>
                            <Link to="/all artwork/drawings" className="cursor-pointer">DRAWINGS</Link>
                            </li>
                        <li>
                            <Link to="/all artwork/paintings" className="cursor-pointer">PAITINGS</Link>
                            </li>
                        <li>
                            <Link to="/seller profile" className="cursor-pointer">ARTISTS</Link>
                            </li>
                        <li>SELL PAINTINGS</li>
                    </ul>
                </div>
                <div className="flex flex-row space-x-4 text-2xl">
                    <div className="relative">
                    <AiOutlineSearch 
                       className="cursor-pointer"
                       onClick={() => setIsSearchOpen(!isSearchOpen)} 
                       />
                    </div>
                       {isSearchOpen && (
                        <div className="absolute right-0 mt-6 top-0 px-2 py-2 bg-green-300 w-80 h-screen">
                          <div className="flex justify-between mt-7">
                            <p className="text-xl font-semibold">SEARCH OUR SITE</p>
                            <AiOutlineClose onClick={() => setIsSearchOpen(false)}/>
                          </div>
                          <div>
                            <input
                              type="text"
                              name="searchText"
                              id="searchText"
                              placeholder="Search for artwork"
                              value={searchText || ""}
                              onChange={handleSearchInputChange}
                              className="my-5"


                            />
                            <AiOutlineSearch />
                          </div>
                          <div>
                            {searchResults && searchResults.length > 0 ? (
                                <div>
                                    {searchResults.map((item, index) => (
                                        <div key={index} className="flex ">
                                            <Link to={`/artpage/${encodeURIComponent(item.title)}`}>
                                            <img 
                                               src={item.artPhoto}
                                               alt="art Photo"
                                               className="h-12 w-12"

                                            />
                                            <p>{item.title}</p>
                                            </Link>

                                        </div>
                                    ))}
                                    </div>
                            ) : (
                                <div>
                                <h1>No Results found!</h1>
                                </div>
                            )}
                          </div>
                        </div>

                       )}
                    
                    <Link to="/wishlist" className="relative flex">
                        <PiHeartStraightThin  />
                        <span className="absolute right-0 top-0 rounded-full bg-blue-200 w-4 h-4 top right p-0 m-0 text-sm leading-tight text-center">
                            {wishListedNumber}
                        </span>
                    </Link>
                    <Link to="/cartlist" className="relative flex">
                        <AiOutlineShoppingCart />
                        <span className="absolute right-0 top-0 rounded-full bg-blue-200 w-4 h-4 top right p-0 m-0 text-sm leading-tight text-center">
                            {cartListNumber}
                        </span>
                    </Link>
                    <div>
                        <CgProfile
                           onClick={() => setIsOpen(!isOpen)}
                        />
                            { isOpen && (
                                <div>
                                    <ul>
                                       <li>
                                        <Link>
                                        DASHBOARD
                                        </Link>
                                        </li>
                                       <li>
                                        <Link>
                                        Logout
                                        </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>

            </div>
        </section>
    )
}

export default NavBar;