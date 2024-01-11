import React, { useEffect, useState } from "react";
import Filter from "../Filter/Filter";
import ArtCard from "../Shared/ArtCard";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const AllArtWork = () => {
    const [artWork, setArtWork] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [filteredArtWork, setFilteredArtWork] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/artwork/get/allartwork");
                let sortedArtWork = response.data;

                if (sortBy === "alphabeticalDesc") {
                    sortedArtWork.sort((a, b) => b.title.localeCompare(a.title));
                } else if (sortBy === "priceAsc") {
                    sortedArtWork.sort((a, b) => a.price - b.price);
                } else if (sortBy === "priceDesc") {
                    sortedArtWork.sort((a, b) => b.price - a.price);
                } else if (sortBy === "dateAsc") {
                    sortedArtWork.sort((a, b) => new Date(a.creationYear) - new Date(b.creationYear));
                } else if (sortBy === "dateDesc") {
                    sortedArtWork.sort((a, b) => new Date(b.creationYear) - new Date(a.creationYear));
                } else if (sortBy === "alpabeticalAsc") {
                    sortedArtWork.sort((a, b) => a.title.localeCompare(b.title));
                }

                setArtWork(sortedArtWork);
            } catch (error) {
                console.log("Error fetching all artworks", error);
            }
        };
        fetchData();
    }, [sortBy]);

    const handleSortChange = (e) => {
        const selectedSortBy = e.target.value;
        setSortBy(selectedSortBy);
    };

    const handleFilterChange = (filteredArtWork) => {
        setFilteredArtWork(filteredArtWork);
    };

    const sortedArtworkToDisplay = filteredArtWork.length > 0 ? filteredArtWork.simplifiedArtwork : artWork;

    return (
        <section>
            <NavBar />
            <div>
                <Filter onSortChange={handleSortChange} onFilterChange={handleFilterChange}>
                    <div className="grid grid-cols-4 gap-4 mt-14 mx-6">
                        {sortedArtworkToDisplay.map((artItem, index) => (
                            <div key={index} className="mt-14">
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
                        ))}
                    </div>
                </Filter>
            </div>
        </section>
    );
};

export default AllArtWork;
