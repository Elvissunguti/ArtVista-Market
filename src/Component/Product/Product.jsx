import React from "react";
import { Materials, Quality, Surfaces } from "../Utils/ArtData" 


const Product = () => {
    return (
        <section className="flex flex-col max-w-5xl mx-auto">
            <div className="flex flex-col justify-center w-full">
              <h1 className="mt-4 text-xl font-bold">Upload an ArtWork for sale</h1>
              <div className="flex flex-col  w-full ">
                <form className="flex flex-col justify-center w-full ">
                    <label htmlFor="title" className="font-semibold text-xl mt-5">Title: </label>
                    <input
                       type="text"
                       name="title"
                       id="title"
                       placeholder="title of the art"
                       className=""
                    />

                    <h1 className="font-semibold mt-4 text-xl ">Details</h1>
                    <label className="text-lg">Artwork Size</label>
                    <input
                       type="text"
                       title="size"
                       id="size"
                       placeholder="e.g 16in x 20in"
                       className=""
                    />
                    <label className="mt-4 text-lg">Medium used</label>
                    <select name="medium" id="medium" className=" border">
                        <option disabled selected>Select Medium</option>
                        {Materials.map((material, index) => (
                            <option key={index} value={material}>
                                {material}
                            </option>
                        ))}
                    </select>
                    <label className="mt-4 text-lg">Surfaces used</label>
                    <select name="surface" id="surface" className="">
                        <option disabled selected>Select surface</option>
                        {Surfaces.map((surface, index) => (
                            <option key={index} value={surface}>
                                {surface}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="artType" className="mt-4 text-lg">ArtWork type</label>
                    <select name="artType" id="artType" className="">
                        <option disabled selected>Select ArtWork type</option>
                        <option value="Original">Original</option>
                        <option value="Copy">Copy</option>
                    </select>
                    <label htmlFor="creationYear" className="mt-4 text-lg">Year of Creation</label>
                    <input
                       type="number"
                       name="creationYear"
                       id="creationYear"
                       placeholder="year created..."
                       className=""
                    />
                    <label htmlFor="quality" className="mt-4 text-lg">Quality</label>
                    <select name="quality" id="quality" className="">
                        <option selected disabled>Select Quality</option>
                        {Quality.map((quality, index) => (
                            <option key={index} value={Quality}>
                                {quality}
                            </option>
                        ))}
                    </select>
                    <label htmlFor="delivery" className="mt-4 text-lg">To be delivered as</label>
                    <select name="delivery" id="delivery" className="">
                        <option disabled selected>Select delivery form</option>
                        <option value="Rolled">Rolled</option>
                        <option value="Stretched">Stretched</option>
                    </select>
                    <label className="mt-4 text-lg">Description of the ArtWork</label>
                    <textarea
                      placeholder="Description of the art..."
                      className=""
                    />
                    <label htmlFor="artPhotos" className="mt-4 text-lg">Photos of the ArtWork</label>
                    <input
                       type="file"
                       id="artPhotos"
                       name="artPhotos"
                       accept="image/*"
                       multiple
                    />
                    <label htmlFor="price" className="mt-4 text-lg">Price of the ArtWork</label>
                    <input 
                        type="number"
                        id="price"
                        name="price"
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