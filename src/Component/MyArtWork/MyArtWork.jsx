import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest, makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import Art from "../Shared/Art";


const MyArtWork = ( ) => {

    const [ artWork, setArtWork ] = useState([]);


    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artwork/get/myartworks"
                );
                setArtWork(response.data);
            } catch (error){
                console.error("Error fetching artworks of the current user", error)
            }
        }
        fetchData();
    }, []);


    const handleMarkAsSold = async (artWorkId) => {
        try {
            // Make a request to mark the artwork as sold
            await makeAuthenticatedPOSTRequest(`/artwork/sold/${artWorkId}`);
            
            // Update the local state to mark the artwork as sold without making another API call
            setArtWork((prevArtWork) =>
              prevArtWork.map((artItem) =>
                artItem._id === artWorkId ? { ...artItem, isSold: true } : artItem
              )
            );
          } catch (error) {
            console.error("Error marking artwork as sold", error);
          }
    }

    return (
        <section>
            <NavBar />
            <div>
                <h2 className="text-center mt-5">My artworks</h2>
            </div>
            <div>
                {artWork && artWork.length > 0 ? (
                    <div className="flex my-4 flex-col">
                        {artWork.map((artItem) => (
                            <div key={artItem._id}  className="flex flex-row">
                                <Art
                                     artWorkId={artItem._id}
                                     title={artItem.title}
                                     price={artItem.price}
                                     artPhoto={artItem.artPhoto}

                                />
                                <div className="flex justify-center align-center">
                                {!artItem.isSold && (
                                  <button onClick={() => handleMarkAsSold(artItem._id)}>
                                    Mark as Sold
                                  </button>
                                )}
                                </div>

                            </div>
                        ))}
                    </div>
                ): (
                    <p>You have not uploaded any artwork yet...</p>
                )}

            </div>

        </section>
    )
}

export default MyArtWork;