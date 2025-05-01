import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import Filter from "../Filter/Filter";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import ArtCard from "../Shared/ArtCard";


const Paintings = () => {

    const [ artWork, setArtWork ] = useState([]);
    const [sortBy, setSortBy] = useState(null);
    const [filteredArtWork, setFilteredArtWork] = useState([]);
    const [loading, setLoading] = useState(true); 


    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/artwork/allpaintings"
                );
                let sortedArtWork = [...response.data];

                switch (sortBy) {
                  case "alphabeticalDesc":
                      sortedArtWork.sort((a, b) => b.title.localeCompare(a.title));
                      break;
                  case "priceAsc":
                      sortedArtWork.sort((a, b) => 
                        parseFloat(a.price.replace(/,/g, "")) - parseFloat(b.price.replace(/,/g, "")));
                      break;
                  case "priceDesc":
                      sortedArtWork.sort((a, b) => 
                        parseFloat(b.price.replace(/,/g, "")) - parseFloat(a.price.replace(/,/g, "")));
                      break;
                  case "dateAsc":
                      sortedArtWork.sort((a, b) => new Date(a.creationYear) - new Date(b.creationYear));
                      break;
                  case "dateDesc":
                      sortedArtWork.sort((a, b) => new Date(b.creationYear) - new Date(a.creationYear));
                      break;
                  case "alphabeticalAsc": 
                      sortedArtWork.sort((a, b) => a.title.localeCompare(b.title));
                      break;
                  default:
                      // Default can be left as unsorted or sorted as needed
                      break;
              }

                  setArtWork(sortedArtWork);
            } catch (error){
                console.log("Error fetching drawing artworks", error);
            }finally {
              setLoading(false); // Set loading to false after data is fetched
          }
        }
        fetchData();
    }, [sortBy]);


    const handleSortChange = (e) => {
        const selectedSortBy = e.target.value;
        setSortBy(selectedSortBy);
      };


      const handleFilterChange = (filteredArtWork) => {
        console.log("Filtered Artwork:", filteredArtWork);
        setFilteredArtWork(filteredArtWork);
    };

    const sortedArtworkToDisplay = filteredArtWork.length > 0 ? filteredArtWork.simplifiedArtwork : artWork;



    return (
        <section>
            <NavBar />
            <div>
            <Filter onSortChange={handleSortChange} onFilterChange={handleFilterChange} sortBy={sortBy}>
            {loading ? (
                    // Loading spinner with main color
                    <div className="flex justify-center items-center h-96 ">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#9A7B4F] border-solid"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mx-4 sm:mx-6">
                        {sortedArtworkToDisplay.map((artItem, index) => (
                            <div key={index} className="mt-6 sm:mt-8">
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
                )}
                </Filter>
            </div>
            
        </section>
    )
}
export default Paintings;