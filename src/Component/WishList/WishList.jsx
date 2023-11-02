import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import ArtCard from "../Shared/ArtCard";
import NavBar from "../Home/NavBar";


const WishList = () => {

    const [ artWork, setArtWork ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/wishList/wishlisted"
                );
                setArtWork(response.data);
            } catch (error){
                console.error("Error fetching wishlisted artwork:", error);
            }
        }
        fetchData();
    }, []);


    return(
        <section>
            <NavBar />
            <div className="mt-8">
                <div className="flex justify-center items-center text-2xl font-bold bg-grey-300">
                    <p>View Your Wishlist products</p>
                </div>
                <div>
                   <div className="grid grid-cols-4 justify-center items-center gap-4 mt-14 mx-6">
                        {artWork.map((artItem, index) => (
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
                                   
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
};
export default WishList;