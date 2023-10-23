import React, { useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Collections, Materials, Surfaces, artistList } from "../Utils/ArtData";
import "../../App.css";
import ArtCard from "../Shared/ArtCard";



const Search = ({ children }) => {

    const minRange = 249;
    const maxRange = 100000000;

    const [ range, setRange ] = useState([minRange, maxRange]);

    const handleRangeChange = (newRange) => {
        setRange(newRange);
      };


    return(
        <section className="mx-auto max-w-7xl">
            <div className="flex flex-row ">
                <div className="w-1/5">
                    <h1>Filters</h1>
                    <div>
                        <h1>PRICE</h1>
                        <div>
                            <input
                               type="text"
                               id ="minPrice"
                               name="minPrice"
                               min="249"
                               placeholder="249"
                               className=""
                            />
                            <input
                               type="text"
                               id="maxPrice"
                               name="maxPrice"
                               max={100000000}
                               placeholder="100,000,000"
                               className=""
                            />
                            <div className="cursor-pointer">
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
                        <p>COLLECTION</p>
                        <div className="h-64 overflow-auto custom-scrollbar">
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
                        <p>ARTISTS</p>
                        <div className="h-64 overflow-auto custom-scrollbar">
                            {artistList.map((artist, index) => (
                                <div key={index} className="my-3">
                                    <input
                                       type="radio"
                                       name="artist"
                                       value={artist}
                                    />
                                    <label className="ml-3">{artist}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p>MATERIAL</p>
                        <div className="h-64 overflow-auto custom-scrollbar">
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
                        <p>SURFACE</p>
                        <div className="h-64 overflow-auto custom-scrollbar">
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
                <div className="mt-8">
                   {children}
                 </div>
                </div>
            </div>
        </section>
        
    )
}
export default Search;