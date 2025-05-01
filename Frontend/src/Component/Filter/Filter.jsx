import React, { useEffect, useState } from "react";
import 'rc-slider/assets/index.css';
import "../../App.css";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";



const Filter = ({ sortBy, onSortChange, onFilterChange, children }) => {

    const [ artistData, setArtistData ] = useState([]);
    const [ medium, setMedium ] = useState([]);
    const [ surface, setSurface ] = useState([]); 
    const [ category, setCategory ] = useState([]); 
    const [ userName, setUserName ] = useState(null);
    const [ selectedCategory, setSelectedCategory ] = useState(null);
    const [selectedMedium, setSelectedMedium] = useState(null);
    const [selectedSurface, setSelectedSurface] = useState(null);
    const [ filteredMedium, setFilteredMedium ] = useState([]);
    const [ filteredSurface, setFilteredSurface ] = useState([]);
    const [ filteredCategory, setFilteredCategory ] = useState([]);

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
        const categoryData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artwork/category"
                );
                const modifiedCategory = response.data.map(item => ({
                    value: item.category,
                    count: item.count,
                }));
                setCategory(modifiedCategory);
            } catch (error){
                console.error("Error fetching the different category used:", error);
            }
        };
        categoryData();
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
                    `/filter/all?userName=${userName || ''}&medium=${selectedMedium || ''}&surface=${selectedSurface || ''}&category=${selectedCategory || ''}`
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

                const modifiedCategory = response.data.categoryCounts.map(item => ({
                    value: item.category,
                    count: item.count
                }));
                setFilteredCategory(modifiedCategory);

                onFilterChange(response.data);
            } catch (error) {
                console.error("Error fetching filtered artworks", error);
            }
        };
    
        handleFilterChange();
    }, [userName, selectedMedium, selectedSurface, selectedCategory]);
    
  
    return (
        <section className="mx-auto max-w-7xl mt-4 px-4 lg:px-0">
        <div className="flex flex-row w-full space-y-4 lg:space-y-0">
            <div className=" w-1/3 lg:w-1/5 mr-8">
                <h1 className="text-2xl font-semibold mb-4">Filters</h1>
    
                {/* Artists Filter with Skeleton */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Artists</h2>
                    <div className="max-h-64 overflow-auto">
                        {artistData.length > 0 ? (
                            artistData.map((artist, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="artist"
                                            value={artist.artist}
                                            onChange={() => setUserName(artist.artist)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">
                                            {artist.artist} ({artist.artWorkCount})
                                        </span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="animate-pulse mb-2">
                                    <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
    
                {/* Material Filter with Skeleton */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Material</h2>
                    <div className="max-h-64 overflow-auto">
                        {(filteredMedium.length > 0 ? filteredMedium : medium).length > 0 ? (
                            (filteredMedium.length > 0 ? filteredMedium : medium).map((material, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="material"
                                            value={material.value}
                                            onChange={() => setSelectedMedium(material.value)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">
                                            {material.value} ({material.count})
                                        </span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="animate-pulse mb-2">
                                    <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
    
                {/* Surface Filter with Skeleton */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Surface</h2>
                    <div className="max-h-64 overflow-auto">
                        {(filteredSurface.length > 0 ? filteredSurface : surface).length > 0 ? (
                            (filteredSurface.length > 0 ? filteredSurface : surface).map((surface, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="surface"
                                            value={surface.value}
                                            onChange={() => setSelectedSurface(surface.value)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">
                                            {surface.value} ({surface.count})
                                        </span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="animate-pulse mb-2">
                                    <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
    
                {/* Category Filter with Skeleton */}
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Category</h2>
                    <div className="max-h-64 overflow-auto">
                        {(filteredCategory.length > 0 ? filteredCategory : category).length > 0 ? (
                            (filteredCategory.length > 0 ? filteredCategory : category).map((category, index) => (
                                <div key={index} className="form-control mb-2">
                                    <label className="label cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="surface"
                                            value={category.value}
                                            onChange={() => setSelectedCategory(category.value)}
                                            className="checkbox checkbox-primary"
                                        />
                                        <span className="label-text ml-3">
                                            {category.value} ({category.count})
                                        </span>
                                    </label>
                                </div>
                            ))
                        ) : (
                            Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="animate-pulse mb-2">
                                    <div className="h-4 bg-gray-400 rounded w-3/4 mb-2"></div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        
                <div className="flex flex-col sm:w-2/3 lg:w-4/5">
                    <div className="flex justify-between mb-4">
                        <select onChange={onSortChange} className="select select-bordered ml-auto" value={sortBy || ""}>
                        <option value="" disabled  hidden>Sort by:</option>
                            <option value="alphabeticalAsc">Alphabetically, A-Z</option>
                            <option value="alphabeticalDesc">Alphabetically, Z-A</option>
                            <option value="priceAsc">Price, low to high</option>
                            <option value="priceDesc">Price, high to low</option>
                            <option value="dateAsc">Date, old to new</option>
                            <option value="dateDesc">Date, new to old</option>
                        </select>
                    </div>

                    <div className="">
                        {children}
                    </div>
                </div>
            </div>
        </section>
    );
};
export default Filter;