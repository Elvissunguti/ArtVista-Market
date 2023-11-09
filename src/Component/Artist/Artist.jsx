import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { IoIosSearch } from "react-icons/io";
import thumbnail from "../../Assets/thumbnail.webp";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const Artist = () => {
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    "/artist/get/artist"
                );
                response.data = response.data.map(item => ({
                    ...item,
                    profilePic: item.profilePic ? `/ProfilePic/${item.profilePic.split("\\").pop()}` : null,
                }));
                setProfileData(response.data);
            } catch (error) {
                console.error("Error fetching user's profile", error);
            }
        };
        fetchData();
    }, []);

    return (
        <section>
            <NavBar />
            <div className="flex flex-row">
                <div>
                    <p>Sort By:</p>
                    <select>
                        <option>Name Ascending</option>
                        <option>Name Descending</option>
                    </select>
                </div>
                <div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search"
                        className=""
                    />
                    <button>
                        <IoIosSearch /> Search
                    </button>
                </div>
            </div>
            <div className="grid grid-row-5 mt-8">
                {profileData !== null ? (
                    profileData.map((item, index) => (
                        <div key={index}>
                            <div>
                                {item.profilePic ? (
                                    <img
                                        src={item.profilePic}
                                        alt="user thumbnail"
                                        className="h-48 w-48 object-cover"
                                    />
                                ) : (
                                    <img
                                        src={thumbnail}
                                        alt="user thumbnail"
                                        className=""
                                    />
                                )}
                            </div>
                            <div>
                                <p>{item.userName}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </section>
    );
};

export default Artist;
