import React, { useEffect, useState } from "react";
import Search from "../Search/Search";
import ArtCard from "../Shared/ArtCard";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const AllArtWork = () => {

    const [ artWork, setArtWork ] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artwork/get/allartwork",
                );
                setArtWork(response.data);
            } catch (error){
                console.log("Error fetching all artworks", error);

            }
        }
        fetchData()
    }, [])

    return (
        <section>
            <NavBar />
            <div>
                <Search>
                    <div>
                        {artWork.map((artItem, index) => (
                            <div key={index} className="grid grid-cols-4 gap-4 mt-14">
                                <ArtCard
                                title={artItem.title}
                                price={artItem.price}
                                artPhoto={artItem.artPhoto}
                                   
                                />
                            </div>
                        ))}
                    </div>
                    

                </Search>

            </div>
        </section>
    )
}
export default AllArtWork;