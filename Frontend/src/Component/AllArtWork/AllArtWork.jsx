import React, { useEffect, useState } from "react";
import Filter from "../Filter/Filter";
import ArtCard from "../Shared/ArtCard";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const AllArtWork = () => {
    const [artWork, setArtWork] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [filteredArtWork, setFilteredArtWork] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [filterResult, setFilterResult] = useState(null); 
    const [displayedArtWork, setDisplayedArtWork] = useState([]);
    const [filteredData, setFilteredData] = useState([]);




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/artwork/get/allartwork");
                setArtWork(response.data);
                setFilteredData(response.data); // set initial filtered data to full artwork list
            } catch (error) {
                console.error("Error fetching all artworks", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


        // Apply sorting when sortBy or filteredData changes
        useEffect(() => {
            if (!filteredData) return;
    
            let sorted = [...filteredData];
    
            switch (sortBy) {
                case "alphabeticalAsc":
                    sorted.sort((a, b) => a.title.localeCompare(b.title));
                    break;
                case "alphabeticalDesc":
                    sorted.sort((a, b) => b.title.localeCompare(a.title));
                    break;
                case "priceAsc":
                    sorted.sort((a, b) =>
                        parseFloat(a.price.replace(/,/g, "")) - parseFloat(b.price.replace(/,/g, "")) 
                    )
                    break;
                case "priceDesc":
                    sorted.sort((a, b) => 
                        parseFloat(b.price.replace(/,/g, "")) - parseFloat(a.price.replace(/,/g, "")))
                    break;
                case "dateAsc":
                    sorted.sort((a, b) => new Date(a.creationYear) - new Date(b.creationYear));
                    break;
                case "dateDesc":
                    sorted.sort((a, b) => new Date(b.creationYear) - new Date(a.creationYear));
                    break;
                default:
                    break;
            }
    
            setDisplayedArtWork(sorted);
        }, [sortBy, filteredData]);

    const handleSortChange = (e) => {
        const selectedSortBy = e.target.value;
        setSortBy(selectedSortBy);
    };

    

    const handleFilterChange = (filteredResponse) => {
        if (filteredResponse?.simplifiedArtwork?.length) {
            setFilteredData(filteredResponse.simplifiedArtwork);
        } else {
            setFilteredData([]);
        }
    };


    const artworkToDisplay = filterResult?.simplifiedArtwork?.length
    ? filterResult.simplifiedArtwork
    : artWork;

    const sortedArtworkToDisplay = filteredArtWork.length > 0 ? filteredArtWork.simplifiedArtwork : artWork;

    return (
        <section>
            <NavBar />
            <div>
                <Filter onSortChange={handleSortChange} onFilterChange={handleFilterChange}  sortBy={sortBy}>
                {loading ? (
                    // Loading spinner with main color
                    <div className="flex justify-center items-center h-96 ">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#9A7B4F] border-solid"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 sm:mx-6">
                    {displayedArtWork.length > 0 ? (
                        displayedArtWork.map((artItem, index) => (
                            <div key={index} className="mt-6 sm:mt-8">
                                <ArtCard
                                    artWorkId={artItem._id}
                                    title={artItem.title}
                                    price={artItem.price}
                                    artPhoto={artItem.artPhoto}
                                    size={artItem.size}
                                    medium={artItem.medium}
                                    surface={artItem.surface}
                                    artType={artItem.artType}
                                    creationYear={artItem.creationYear}
                                    quality={artItem.quality}
                                    delivery={artItem.delivery}
                                    description={artItem.description}
                                    isSold={artItem.isSold}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center col-span-full text-gray-500 mt-10">
                            No artworks match your filters.
                        </div>
                    )}
                </div>
                )}
                </Filter>
            </div>
        </section>
    );
};

export default AllArtWork;
