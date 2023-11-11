import React, { useState } from "react";
import NavBar from "../Home/NavBar";


const ArtistPage = () => {

    const [ artWork, setArtWork ] = useState(true); 
    const [ artWorkData, setArtWorkData ] = useState([]);
    const [ displayDescription, setDisplayDescription ] = useState(false);


    const toggleArtWork = () => {
        setArtWork(true);
        setDisplayDescription(false);
    };
    
    const toggleDescription = () => {
        setDisplayDescription(true);
        setArtWork(false);
    };



    return (
        <section>
            <NavBar />
            <div>
                <div>
                    <img 
                      src={profilePic}
                      alt="profilePic"
                      className=""
                    />
                    <div>
                        <p>userName</p>
                        <p>location</p>
                        <p>Total Artwork no</p>
                    </div>
                </div>
            </div>
            <div className="flex mt-10">
                    <ul className="grid grid-cols-2 w-full divide-x-4 border">
                        <li className="text-xl font-bold ">
                          <button onClick={toggleArtWork}
                          className={`text-xl font-bold w-full px-3 py-3 ${artWork ? "bg-gray-300 " : "hover:bg-gray-200"} hover:text-white`}
                          >Artworks</button>
                        </li>
                        <li className="text-xl font-bold">
                          <button onClick={toggleDescription}
                            className={`text-xl font-bold w-full px-3 py-3 ${displayDescription ? "bg-gray-300" : "hover:bg-gray-200"} hover:text-white`}
                          >
                            About the Art Gallery
                          </button>
                        </li>
                    </ul>
                    </div>
                    <div>
                        {artWork && (
                            <div>
                                <div>
                                <label>Sort By:</label>
                                <select>
                                    <option>Name Ascending</option>
                                    <option>Name Descending</option>
                                    <option>Price Ascending</option>
                                    <option>Price Descending</option>
                                </select>
                            </div>
                            <div>
                                <label>Show :</label>
                                <select>
                                    <option>16</option>
                                    <option>32</option>
                                    <option>50</option>
                                </select>
                            </div>
                            <div>
                                <input 
                                   type="text"
                                   name="search"
                                   id="search"
                                   placeholder="Search"
                                   className=""
                                />
                            </div>
                             <div>
                                <div>
                                <label>Filter by category</label>
                                </div>
                                <div>
                                    { artWorkData.map((item, index) => (
                                        <div>
                                            <ArtCard
                                              artPhoto={item.artPhoto}
                                              title={item.title}
                                              price={item.price}

                                            />
                                        </div>
                                    ))}
                                </div>
                             </div>
                            </div>
                        )}
                        {displayDescription && (
                            <div>
                                <p>{description}</p>
                            </div>
                        )}
                    </div>
        </section>
    )
}
export default ArtistPage;