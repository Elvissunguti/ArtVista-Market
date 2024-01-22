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
        <section className="bg-gray-100 min-h-screen">
        <NavBar />
  
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-semibold text-center mb-8">My Artworks for Sale</h2>
  
          <div>
            {artWork && artWork.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artWork.map((artItem) => (
                  <div key={artItem._id} className="bg-white p-4 rounded-lg shadow-md">
                    <Art
                      artWorkId={artItem._id}
                      title={artItem.title}
                      price={artItem.price}
                      artPhoto={artItem.artPhoto}
                    />
  
                    <div className="flex justify-center mt-4">
                      {!artItem.isSold ? (
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-full"
                          onClick={() => handleMarkAsSold(artItem._id)}
                        >
                          Mark as Sold
                        </button>
                      ) : (
                        <span className="text-green-500">Artwork Sold</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">You have not uploaded any artwork yet...</p>
            )}
          </div>
        </div>
      </section>
    )
}

export default MyArtWork;