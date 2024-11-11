import React from "react";

const Art = ({ artPhoto, title, price }) => {
  const artPhotoFilename = artPhoto.split("\\").pop();
  const artPhotoUrl = `/ArtImages/${artPhotoFilename}`;

  return (
    <section className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative">
        <img
          src={artPhotoUrl}
          alt="The painting"
          className="w-full h-48 object-cover rounded-md"
        />

      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">{title}</p>
        <p className="text-gray-600">${price}</p>
      </div>
    </section>
  );
};

export default Art;
