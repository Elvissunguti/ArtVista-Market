import React, { useState } from "react";
import { Materials, Quality, Surfaces } from "../Utils/ArtData" 
import { makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";


const Product = () => {

    const [formData, setFormData] = useState({
        title: "",
        size: "",
        medium: "",
        surface: "",
        artType: "",
        creationYear: "",
        quality: "",
        delivery: "",
        description: "",
        price: "",
        artPhoto: [],
      });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        for (const key in formData) {
          if (key === "artPhoto") {
            for (const file of formData[key]) {
              formDataToSend.append(key, file);
            }
          } else {
            formDataToSend.append(key, formData[key]);
          }
        }

        try {
            const response= await makeAuthenticatedMulterPostRequest(
                "/artwork/create", formDataToSend
            );


            if (response.error) {
                // Handle the error
                console.error("Error creating artwork", response.error);
              } else {
                // Handle the successful response
                console.log("Artwork created successfully", response);
              }

        } catch (error){
            console.error("Error creating artwork", error);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleFileChange = (e) => {
        const filesArray = Array.from(e.target.files);

        setFormData({
          ...formData,
          artPhoto: filesArray,
        });
      };
      


    return (
        <section className="flex flex-col max-w-5xl mx-auto">
            <div className="flex flex-col justify-center w-full">
              <h1 className="mt-4 text-xl font-bold">Upload an ArtWork for sale</h1>
              <div className="flex flex-col  w-full ">
                <form onSubmit={handleSubmit} className="flex flex-col justify-center w-full ">
                    <label htmlFor="title" className="font-semibold text-xl mt-5">Title: </label>
                    <input
                       type="text"
                       name="title"
                       id="title"
                       placeholder="title of the art"
                       value={formData.title}
                       onChange={handleChange}
                       className=""
                    />

                    <h1 className="font-semibold mt-4 text-xl ">Details</h1>
                    <label htmlFor="size" className="text-lg">Artwork Size</label>
                    <input
                       type="text"
                       title="size"
                       id="size"
                       name="size"
                       placeholder="e.g 16in x 20in"
                       value={formData.size}
                       onChange={handleChange}
                       className=""
                    />
                    <label className="mt-4 text-lg">Medium used</label>
                    <select name="medium" id="medium" className=" border" value={formData.medium} onChange={handleChange}>
                        <option disabled value="">Select Medium</option>
                        {Materials.map((material, index) => (
                            <option key={index} value={material}>
                                {material}
                            </option>
                        ))}
                    </select>
                    <label className="mt-4 text-lg">Surfaces used</label>
                    <select name="surface" id="surface" className="" value={formData.surface} onChange={handleChange}>
                        <option disabled value="">Select surface</option>
                        {Surfaces.map((surface, index) => (
                            <option key={index} value={surface}>
                                {surface}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="artType" className="mt-4 text-lg">ArtWork type</label>
                    <select name="artType" id="artType" className="" value={formData.artType} onChange={handleChange}>
                        <option disabled value="" >Select ArtWork type</option>
                        <option value="Original">Original</option>
                        <option value="Copy">Copy</option>
                    </select>
                    <label htmlFor="creationYear" className="mt-4 text-lg">Year of Creation</label>
                    <input
                       type="number"
                       name="creationYear"
                       id="creationYear"
                       placeholder="year created..."
                       value={formData.creationYear}
                       onChange={handleChange}
                       className=""
                    />
                    <label htmlFor="quality" className="mt-4 text-lg">Quality</label>
                    <select name="quality" id="quality" className="" value={formData.quality} onChange={handleChange}>
                        <option disabled value="">Select Quality</option>
                        {Quality.map((quality, index) => (
                            <option key={index} value={Quality}>
                                {quality}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="delivery" className="mt-4 text-lg">To be delivered as</label>
                    <select name="delivery" id="delivery" className="" value={formData.delivery} onChange={handleChange}>
                        <option disabled value="">Select delivery form</option>
                        <option value="Rolled">Rolled</option>
                        <option value="Stretched">Stretched</option>
                    </select>
                    <label htmlFor="description" className="mt-4 text-lg">Description of the ArtWork</label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="Description of the art..."
                      value={formData.description}
                      onChange={handleChange}
                      className=""
                    />
                    <label htmlFor="artPhoto" className="mt-4 text-lg">Photos of the ArtWork</label>
                    <input
                       type="file"
                       id="artPhoto"
                       name="artPhoto"
                       accept="image/*"
                       multiple
                       onChange={handleFileChange}
                    />
                    <label htmlFor="price" className="mt-4 text-lg">Price of the ArtWork</label>
                    <input 
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="In Dollars..."
                
                    />
                    <div>
                        <button type="submit" className="text-white px-2 py-3 rounded-lg bg-green-500 hover:bg-green-800 ">
                             SUBMIT
                        </button>
                    </div>
                </form>
              </div>
            </div>
        </section>
    )
}
export default Product;