import React from "react";


const Art = ({ artPhoto, title, price }) => {

    const artPhotoFilename = artPhoto.split("\\").pop();
    const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;


    return (
        <section>
            <div>
                <img 
                  src={artPhotoUrl}
                  alt="The painting" 
                  className="w-48 h-48 "
                />
                <div>
                    <p>"{title}"</p>
                    <p>${price}</p>
                </div>

            </div>
        </section>
    )
}

export default Art;