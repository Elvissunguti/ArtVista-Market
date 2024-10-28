import React, { useEffect, useState } from "react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { Collections } from "../Utils/ArtData";
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

  
    return (
        <section className="mx-auto max-w-7xl flex mt-4">
            <div className="flex flex-row w-full">
                <div className="w-1/5 mr-8">
                    <h1 className="text-2xl font-semibold mb-4">Filters</h1>
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Price</h2>
                        <div className="flex space-x-4 mb-4">
                            <input
                                type="number"
                                id="minPrice"
                                name="minPrice"
                                min={minRange}
                                value={minPrice}
                                onChange={handleMinPriceChange}
                                className="input input-bordered w-28"
                            />
                            <input
                                type="number"
                                id="maxPrice"
                                name="maxPrice"
                                max={maxRange}
                                value={maxPrice}
                                onChange={handleMaxPriceChange}
                                className="input input-bordered w-28"
                            />
                        </div>
                        <div className="my-4">
                            <Slider
                                min={minRange}
                                max={maxRange}
                                range
                                value={range}
                                onChange={handleRangeChange}
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Collection</h2>
                        <div className="max-h-64 overflow-auto">
                            {Collections.map((collection, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="collection"
                                            value={collection}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">{collection}</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Artists</h2>
                        <div className="max-h-64 overflow-auto">
                            {artistData.map((artist, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="artist"
                                            value={artist.artist}
                                            onChange={() => setUserName(artist.artist)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">{artist.artist} ({artist.artWorkCount})</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Material</h2>
                        <div className="max-h-64 overflow-auto">
                            {(filteredMedium.length > 0 ? filteredMedium : medium).map((material, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="material"
                                            value={material.value}
                                            onChange={() => setSelectedMedium(material.value)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">{material.value} ({material.count})</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-2">Surface</h2>
                        <div className="max-h-64 overflow-auto">
                            {(filteredSurface.length > 0 ? filteredSurface : surface).map((surface, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="surface"
                                            value={surface.value}
                                            onChange={() => setSelectedSurface(surface.value)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">{surface.value} ({surface.count})</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-4/5">
                    <div className="flex justify-between mb-4">
                        <select onChange={onSortChange} className="select select-bordered ml-auto">
                            <option disabled>Sort by:</option>
                            <option value="alphabeticalAsc">Alphabetically, A-Z</option>
                            <option value="alphabeticalDesc">Alphabetically, Z-A</option>
                            <option value="priceAsc">Price, low to high</option>
                            <option value="priceDesc">Price, high to low</option>
                            <option value="dateAsc">Date, old to new</option>
                            <option value="dateDesc">Date, new to old</option>
                        </select>
                    </div>

                    <div className="flex-grow">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Filter;