import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import ArtCard from "../Shared/ArtCard";
import NavBar from "../Home/NavBar";

const WishList = () => {
    const [artWork, setArtWork] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    "/wishList/wishlisted"
                );
                const items = response.data || [];
                setArtWork(items);
            } catch (error) {
                console.error("Error fetching wishlisted artwork:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <section>
            <NavBar />
            <div className="mt-8">
                <div className="flex justify-center items-center text-2xl font-bold bg-grey-300">
                    <p>View Your Wishlist products</p>
                </div>
                <div>
                    {loading ? (
                        <div className="min-h-screen flex justify-center overflow-none">
                            <div className="animate-spin w-20 h-20 border-t-4 border-[#9A7B4F] border-solid rounded-full"></div>
                        </div>
                    ) : (
                        <>
                            {artWork.length === 0 ? (
                                <p>Your wishlist is empty.</p>
                            ) : (
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
                            )}
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default WishList;
