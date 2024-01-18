import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { IoIosSearch } from "react-icons/io";
import thumbnail from "../../Assets/thumbnail.webp";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { Link } from "react-router-dom";

const Artist = () => {
    const [profileData, setProfileData] = useState(null);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [sortOption, setSortOption] = useState("nameAsc"); // Default sorting option

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/artist/get/artist");
                if (response.data) {
                    const updatedData = response.data.map((item) => ({
                        ...item,
                        profilePic: item.profilePic
                            ? `/ProfilePic/${item.profilePic.split("\\").pop()}`
                            : null,
                    }));

                    // Sorting logic based on the selected option
                    const sortedData = sortData(updatedData, sortOption);

                    setProfileData(sortedData);
                } else {
                    console.error("Response data is undefined or null");
                }
            } catch (error) {
                console.error("Error fetching user's profile", error);
            }
        };
        fetchData();
    }, [sortOption]); // Refetch data when sorting option changes

    useEffect(() => {
        // Refetch data when searchText changes
        fetchSearchResults();
    }, [searchText]);

    const fetchSearchResults = async () => {
        try {
            // Adjust the API route and query parameter based on your backend implementation
            const response = await makeAuthenticatedGETRequest(`/search/artistsearch?searchText=${searchText}`);
            if (response.data) {
                const updatedData = response.data.map((item) => ({
                    ...item,
                    profilePic: item.profilePic
                        ? `/ProfilePic/${item.profilePic.split("\\").pop()}`
                        : null,
                }));
                setSearchResults(updatedData);
            } else {
                setSearchResults(null);
                console.error("Response data is undefined or null");
            }
        } catch (error) {
            console.error("Error fetching search results", error);
        }
    };

    const handleSearch = () => {
        // Trigger a refetch when the search button is clicked
        fetchSearchResults();
    };

    const handleSortChange = (event) => {
        // Update the sorting option when the dropdown changes
        setSortOption(event.target.value);
    };

    const displayData = searchText ? searchResults : profileData;

    return (
        <section className="bg-gray-100 min-h-screen">
        <NavBar />
        <div className="container mx-auto p-8">
            <div className="flex flex-row justify-between items-center mb-6">
                <div className="flex items-center">
                    <p className="mr-2">Sort By:</p>
                    <select
                        onChange={handleSortChange}
                        value={sortOption}
                        className="border p-2 rounded"
                    >
                        <option value="nameAsc">Name Ascending</option>
                        <option value="nameDesc">Name Descending</option>
                    </select>
                </div>
                <div className="relative flex items-center">
                    <div className="relative">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="border p-2 rounded mr-2 pr-8 pl-2"
                    />
                    <div className="absolute z-10 inset-y-0 right-0 flex items-center pr-3 pointer-events-none ">
                    <IoIosSearch className="text-gray-400"  />
                    </div>
                    </div>
                    
                    <button
                        onClick={handleSearch}
                        className="bg-blue-500 text-white p-2 rounded"
                    >
                        
                        Search
                    </button>
                    
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {displayData !== null ? (
                    displayData.map((item, index) => (
                        <Link
                            to={`/seller-profile/${item.userName}`}
                            className="bg-white p-4 rounded shadow-md transition-transform transform hover:scale-105"
                            key={index}
                        >
                            <div className="mb-4">
                                {item.profilePic ? (
                                    <img
                                        src={item.profilePic}
                                        alt="user thumbnail"
                                        className="w-full h-40 object-cover rounded"
                                    />
                                ) : (
                                    <img
                                        src={thumbnail}
                                        alt="user thumbnail"
                                        className="w-full h-40 object-cover rounded"
                                    />
                                )}
                            </div>
                            <div>
                                <p className="text-lg font-semibold">{item.userName}</p>
                            </div>
                        </Link>
                    ))
                ) : (
                  <div className="min-h-screen flex  justify-center overflow-none">
                    <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] border-solid rounded-full"></div>
                  </div> 
                )}
            </div>
        </div>
    </section>
    );
};

// Sorting function based on the selected option
const sortData = (data, sortOption) => {
    switch (sortOption) {
        case "nameAsc":
            return data.slice().sort((a, b) => a.userName.localeCompare(b.userName));
        case "nameDesc":
            return data.slice().sort((a, b) => b.userName.localeCompare(a.userName));
        default:
            return data;
    }
};

export default Artist;
