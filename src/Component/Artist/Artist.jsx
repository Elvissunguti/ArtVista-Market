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
        <section>
            <NavBar />
            <div className="flex flex-row justify-between mt-6">
                <div className="flex flex-row">
                    <p>Sort By:</p>
                    <select onChange={handleSortChange} value={sortOption}>
                        <option value="nameAsc">Name Ascending</option>
                        <option value="nameDesc">Name Descending</option>
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className=""
                    />
                    <button onClick={handleSearch}>
                        <IoIosSearch /> Search
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-4 mt-8">
                {displayData !== null ? (
                    displayData.map((item, index) => (
                        <Link to={`/seller-profile/${item.userName}`} className="grid grid-cols-4 mt-8" key={index}>
                            <div>
                                <div className="">
                                    {item.profilePic ? (
                                        <img
                                            src={item.profilePic}
                                            alt="user thumbnail"
                                            className="h-48 w-48 "
                                        />
                                    ) : (
                                        <img
                                            src={thumbnail}
                                            alt="user thumbnail"
                                            className="h-48 w-48"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p>{item.userName}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
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
