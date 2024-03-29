import React, { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Collections, Materials, Surfaces } from "../Utils/ArtData";
import "../../App.css";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";



const Filter = ({ onSortChange, onFilterChange, children }) => {

    const [ artistData, setArtistData ] = useState([]);
    const [ medium, setMedium ] = useState([]);
    const [ surface, setSurface ] = useState([]);
    const minRange = 249;
    const maxRange = 1000000;

    const [range, setRange] = useState([minRange, maxRange]);
    const [minPrice, setMinPrice] = useState(minRange);
    const [maxPrice, setMaxPrice] = useState(maxRange);
    const [ userName, setUserName ] = useState(null);
    const [selectedMedium, setSelectedMedium] = useState(null);
    const [selectedSurface, setSelectedSurface] = useState(null);
    const [ filteredMedium, setFilteredMedium ] = useState([]);
    const [ filteredSurface, setFilteredSurface ] = useState([]);

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

    useEffect(() => {
        const mediumData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artwork/medium"
                );
                const modifiedMedium = response.data.map(item => ({
                    value: item.medium,
                    count: item.count
                }));
                setMedium(modifiedMedium);
            } catch (error){
                console.error("Error fetching the different medium used", error);
            }
        };
        mediumData();
    }, []);


    useEffect(() => {
        const surfaceData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artwork/surface"
                );
                const modifiedSurface = response.data.map(item => ({
                    value: item.surface,
                    count: item.count
                }));
                setSurface(modifiedSurface)

            } catch (error){
                console.error("Error fetching the different surface used in the artworks", error);
            }
        };
        surfaceData();
    }, []);


    useEffect(() => {
        const handleFilterChange = async () => {
            try {
                console.log("Filter Parameters:", userName, selectedMedium, selectedSurface);
                const response = await makeAuthenticatedGETRequest(
                    `/filter/all?userName=${userName || ''}&medium=${selectedMedium || ''}&surface=${selectedSurface || ''}`
                );
                console.log("Response:", response.data);
                const modifiedMedium = response.data.mediumCounts.map(item => ({
                    value: item.medium,
                    count: item.count
                }));
                setFilteredMedium(modifiedMedium);
    
                const modifiedSurface = response.data.surfaceCounts.map(item => ({
                    value: item.surface,
                    count: item.count
                }));
                setFilteredSurface(modifiedSurface);

                onFilterChange(response.data);
            } catch (error) {
                console.error("Error fetching filtered artworks", error);
            }
        };
    
        handleFilterChange();
    }, [userName, selectedMedium, selectedSurface]);
    

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
        <section className="mx-auto max-w-7xl flex mt-4">
            <div className="flex flex-row ">
                <div className="w-1/5 mr-8">
                    <h1 className="text-xl font-semibold mb-2">Filters</h1>
                    <div>
                        <h1 className="text-xl font-semibold mb-2">PRICE</h1>
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
                                     type="checkbox" 
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
                                       type="checkbox"
                                       name="artist"
                                       value={artist.artist}
                                       onChange={() => setUserName(artist.artist)}
                                    />
                                    <label className="ml-3">{artist.artist} <span>{artist.artWorkCount}</span> </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">MATERIAL</p>
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                           {( filteredMedium.length > 0 ? filteredMedium : medium).map((material, index) => (
                                <div key={index} className="my-3">
                                    <input
                                       type="checkbox"
                                       name="material"
                                       value={material.value}
                                       onChange={() => setSelectedMedium(material.value)}
                                    />
                                    <label className="ml-3">{material.value} ({material.count}) </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <p className="text-xl font-semibold">SURFACE</p>
                        <div className="max-h-64 overflow-auto custom-scrollbar">
                          {(filteredSurface.length > 0 ? filteredSurface : surface).map((surface, index) => (
                                <div key={index} className="my-3">
                                    <input
                                        type="checkbox"
                                        name="surface"
                                        value={surface.value}
                                        onChange={() => setSelectedSurface(surface.value)}
                                    />
                                    <label className="ml-3">{surface.value} ({surface.count})</label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col w-4/5">
                <div className="flex justify-end w-full  ">
                    
                    <select onChange={onSortChange} className="px-2 py-3 border  rounded-full">
                        <option disabled >Sort by:</option>
                        <option value="alphabeticalAsc">Alphabetically, A-Z</option>
                        <option value="alphabeticalDesc">Alphabetically, Z-A</option>
                        <option value="priceAsc" >Price, low to high</option>
                        <option value="priceDesc">Price, high to low</option>
                        <option value="dateAsc">Date, old to new</option>
                        <option value="dateDesc">Date, new to old</option>
                      
                    </select>
                    
                </div>
                <div>
                   {children}
                 </div>
                </div>
            </div>
        </section>
        
    )
}
export default Filter;