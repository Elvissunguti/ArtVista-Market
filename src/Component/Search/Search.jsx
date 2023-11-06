import React, { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Collections, Materials, Surfaces } from "../Utils/ArtData";
import "../../App.css";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";



const Search = ({ children }) => {

    const [ artistData, setArtistData ] = useState([]);
    const minRange = 249;
    const maxRange = 1000000;

    const [range, setRange] = useState([minRange, maxRange]);
    const [minPrice, setMinPrice] = useState(minRange);
    const [maxPrice, setMaxPrice] = useState(maxRange);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artist/allartist"
                );
                setArtistData(response.data);

            } catch(error){
                console.error("Error fetching artist details", error)
            }
        }
        fetchData();
    }, []);

    const handleRangeChange = (newRange) => {
        setRange(newRange);
        setMinPrice(newRange[0]);
        setMaxPrice(newRange[1]);
    };

    const handleMinPriceChange = (e) => {
        const newMinPrice = parseInt(e.target.value, 10);
        if (!isNaN(newMinPrice) && newMinPrice >= minRange && newMinPrice <= maxRange) {
            setMinPrice(newMinPrice);
            setRange([newMinPrice, range[1]]);
        }
    };

    const handleMaxPriceChange = (e) => {
        const newMaxPrice = parseInt(e.target.value, 10);
        if (!isNaN(newMaxPrice) && newMaxPrice >= minRange && newMaxPrice <= maxRange) {
            setMaxPrice(newMaxPrice);
            setRange([range[0], newMaxPrice]);
        }
    };

    return(
        <section className="mx-auto max-w-7xl">
            <div className="flex flex-row ">
                <div className="w-1/5">
                    <h1 className="text-xl font-semibold">Filters</h1>
                    <div>
                        <h1 className="text-xl font-semibold">PRICE</h1>
                        <div>
                            <div className="flex w-3/5 space-x-4">
                            <input
                               type="number"
                               id ="minPrice"
                               name="minPrice"
                               min={minRange}
                               placeholder={minRange}
                               value={minPrice}
                               onChange={handleMinPriceChange}
                               className="px-1 py-2 w-28 rounded-lg placeholder-gray-500 border border-gary-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                            <input
                               type="number"
                               id="maxPrice"
                               name="maxPrice"
                               max={maxRange}
                               min={minRange}
                               value={maxPrice}
                               onChange={handleMaxPriceChange}
                               placeholder={maxRange}
                               className="px-1 py-2 w-28 rounded-lg placeholder-gray-500 border border-gary-300 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            />
                            </div>
                            <div className="my-6 cursor-pointer">
                                <Slider
                                   min={minRange}
                                   max={maxRange}
                                   range
                                   value={range}
                                   onChange={handleRangeChange}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">COLLECTION</p>
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                            {Collections.map((collection, index) => (
                               <div key={index} className="my-3">
                                  <input 
                                     type="radio" 
                                     name="collection"
                                     value={collection}
                                    />
                                    <label className="ml-3">{collection}</label>
                               </div>
                            ))}

                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">ARTISTS</p>
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                            {artistData.map((artist, index) => (
                                <div key={index} className="my-3">
                                    <input
                                       type="radio"
                                       name="artist"
                                       value={artist.artist}
                                    />
                                    <label className="ml-3">{artist.artist} <span>{artist.artWorkCount}</span> </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">MATERIAL</p>
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                            {Materials.map((material, index) => (
                                <div key={index} className="my-3">
                                    <input
                                       type="radio"
                                       name="material"
                                       value={material}
                                    />
                                    <label className="ml-3">{material}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">SURFACE</p>
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                            {Surfaces.map((surface, index) => (
                                <div key={index} className="my-3">
                                    <input
                                        type="radio"
                                        name="surface"
                                        value={surface}
                                    />
                                    <label className="ml-3">{surface}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-4/5">
                <div className="flex justify-end w-full ">
                    
                    <select className="px-2 py-3 border  rounded-full">
                        <option disabled selected>Sort by:</option>
                        <option >Alphabetically, Z-A</option>
                        <option >Price, low to high</option>
                        <option>Price, high to low</option>
                        <option>Date, old to new</option>
                        <option>Date, new to old</option>
                      
                    </select>
                    
                </div>
                <div className="mt-1">
                   {children}
                 </div>
                </div>
            </div>
        </section>
        
    )
}
export default Search;