import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { useParams } from "react-router-dom";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import ArtCard from "../Shared/ArtCard";
import thumbnail from "../../Assets/thumbnail.webp";

const ArtistPage = () => {
    const [artWork, setArtWork] = useState(true);
    const [artWorkData, setArtWorkData] = useState([]);
    const [displayDescription, setDisplayDescription] = useState(false);
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [itemsPerPage, setItemsPerPage] = useState(16);
    const [currentPage, setCurrentPage] = useState(1);

    const { userName } = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(`/artist/profile/${userName}`);
                if (response.data) {
                    const updatedData = {
                        ...response.data,
                        profilePic: response.data.profilePic
                            ? `/ProfilePic/${response.data.profilePic.split("\\").pop()}`
                            : null,
                    };
                    setArtWorkData(updatedData);
                    setFilteredArtworks(response.data.artworks || []); // Set initial artwork data
                } else {
                    console.error("Response data is undefined or null");
                }
            } catch (error) {
                console.error("Error fetching profile of an artist", error);
            }
        };
        fetchData();
    }, [userName]);

    // Handlers for filtering and sorting
    useEffect(() => {
        // Apply search and sort whenever the searchQuery, sortOrder, or artwork data changes
        let artworks = [...(artWorkData.artworks || [])];
        
        // Filter by search query
        if (searchQuery) {
            artworks = artworks.filter((item) =>
                item.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort by title
        artworks.sort((a, b) =>
            sortOrder === "asc"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );

        setFilteredArtworks(artworks);
    }, [searchQuery, sortOrder, artWorkData.artworks]);

    // Pagination logic
    const totalPages = Math.ceil(filteredArtworks.length / itemsPerPage);
    const paginatedArtworks = filteredArtworks.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const toggleArtWork = () => {
        setArtWork(true);
        setDisplayDescription(false);
    };

    const toggleDescription = () => {
        setDisplayDescription(true);
        setArtWork(false);
    };

    return (
        <section className="bg-gray-50 min-h-screen">
            <NavBar />
            <div className="container mx-auto mt-8 px-4">
                
                {/* Profile Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8">
                    <div className="w-32 h-32">
                        <img
                            src={artWorkData.profilePic || thumbnail}
                            alt="profilePic"
                            className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h2 className="text-2xl font-semibold">{artWorkData.userName || "Artist Name"}</h2>
                        <p className="text-gray-600">{artWorkData.location || "Location Unknown"}</p>
                        <p className="text-gray-600">Total Artworks: {artWorkData.artworkCount || 0}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex mt-8">
                    <ul className="flex w-full divide-x-2 border rounded-lg overflow-hidden">
                        <li className="w-1/2">
                            <button
                                onClick={toggleArtWork}
                                className={`w-full py-3 text-xl font-semibold ${artWork ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                Artworks
                            </button>
                        </li>
                        <li className="w-1/2">
                            <button
                                onClick={toggleDescription}
                                className={`w-full py-3 text-xl font-semibold ${displayDescription ? "bg-primary text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
                            >
                                About the Art Gallery
                            </button>
                        </li>
                    </ul>
                </div>

                {/* Content Section */}
                <div className="mt-6">
                    {artWork && (
                        <div className="space-y-6">
                            {/* Filters */}
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="form-control w-36">
                                    <label className="label">
                                        <span className="label-text">Sort By</span>
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={sortOrder}
                                        onChange={(e) => setSortOrder(e.target.value)}
                                    >
                                        <option value="asc">Name Ascending</option>
                                        <option value="desc">Name Descending</option>
                                    </select>
                                </div>

                                <div className="form-control w-36">
                                    <label className="label">
                                        <span className="label-text">Show</span>
                                    </label>
                                    <select
                                        className="select select-bordered"
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            setItemsPerPage(Number(e.target.value));
                                            setCurrentPage(1); // Reset to first page
                                        }}
                                    >
                                        <option value={16}>16</option>
                                        <option value={32}>32</option>
                                        <option value={50}>50</option>
                                    </select>
                                </div>

                                <div className="form-control w-full md:w-1/3">
                                    <label className="label">
                                        <span className="label-text">Search</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="search"
                                        placeholder="Search"
                                        className="input input-bordered w-full"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Artworks Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                {paginatedArtworks && paginatedArtworks.length > 0 ? (
                                    paginatedArtworks.map((item, index) => (
                                        <ArtCard
                                            key={index}
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
                                            isSold={item.isSold}
                                        />
                                    ))
                                ) : (
                                    <p className="text-center col-span-full text-gray-500">
                                        No artworks available.
                                    </p>
                                )}
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    className="btn btn-outline mr-2"
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                <span className="text-lg">{currentPage} / {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                    className="btn btn-outline ml-2"
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}

                    {displayDescription && (
                        <div className="mt-6 p-4 bg-white rounded-lg shadow">
                            <p className="text-gray-700">{artWorkData.description || "No description available."}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ArtistPage;
