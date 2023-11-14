import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { useParams } from "react-router-dom";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import ArtCard from "../Shared/ArtCard";


const ArtistPage = () => {

    const [ artWork, setArtWork ] = useState(true); 
    const [ artWorkData, setArtWorkData ] = useState([]);
    const [ displayDescription, setDisplayDescription ] = useState(false);

    const { userName } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                `/artist/profile/${userName}`
                );
                if (response.data) {
                    const updatedData = {
                        ...response.data,
                        profilePic: response.data.profilePic
                            ? `/ProfilePic/${response.data.profilePic.split("\\").pop()}`
                            : null,
                    };
                    setArtWorkData(updatedData);
                } else {
                    console.error("Response data is undefined or null");
                }

            } catch (error){
                console.error("Error fetching profile of an artist", error);
            }
        }
        fetchData();
    }, [userName]);

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
            <div className='mt-6'>
                <div className="flex flex-row">
                    <img 
                      src={artWorkData.profilePic}
                      alt="profilePic"
                      className="h-32 w-32"
                    />
                    <div>
                        <p className="text-2xl font-semibold">{artWorkData.userName}</p>
                        <p>{artWorkData.location}</p>
                        <p>Total Artwork {artWorkData.artworkCount}</p>
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
                                <div className="grid grid-cols-3 gap-3">
                                    { artWorkData.artworks && artWorkData.artworks.map((item, index) => (
                                        <div>
                                            <ArtCard
                                              artPhoto={item.artPhoto}
                                              title={item.title}
                                              price={item.price}
                                              artWorkId={item._id}
                                              size={item.size}
                                              medium={item.medium}
                                              surface={item.surface}
                                              artType={item.artType}
                                              creation={item.creation}
                                              quality={item.quality}
                                              delivery={item.delivery}
                                              description={item.description}

                                            />
                                        </div>
                                    ))}
                                </div>
                             </div>
                            </div>
                        )}
                        {displayDescription && (
                            <div>
                                <p>{artWorkData.description}</p>
                            </div>
                        )}
                    </div>
        </section>
    )
}
export default ArtistPage;