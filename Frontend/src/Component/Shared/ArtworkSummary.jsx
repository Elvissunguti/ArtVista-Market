import React from "react";

const ArtworkSummary = ({ title, artPhoto, price, artType }) => {

    const artPhotoFilename = artPhoto.split("\\").pop();
    const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;

    return (
        <div className="flex mb-4">
            {/* Artwork Photo */}
            <img 
               src={artPhotoUrl}
               alt={title} 
               className="w-16 h-16 object-cover rounded-md mr-4" />

            <div>
                <p className="font-semibold">{title}</p>
                <p className="text-gray-600">$ {price}</p>
                <p className="text-gray-600">artType: {artType}</p>
            </div>
        </div>
    );
};

export default ArtworkSummary;
