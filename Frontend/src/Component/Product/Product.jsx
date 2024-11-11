import React, { useState } from "react";
import { Collections, Materials, Quality, Surfaces,  } from "../Utils/ArtData" 
import { makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";
import NavBar from "../Home/NavBar";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../Utils/Firebase"

const Product = () => {

    const [formData, setFormData] = useState({
        title: "",
        category: "",
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

      const [uploadStatus, setUploadStatus] = useState("");

      const handleSubmit = async (e) => {
        e.preventDefault();

        setUploadStatus("Uploading...");
    
        const imageUrls = [];
        for (const file of formData.artPhoto) {
          const storageRef = ref(storage, `artworks/${file.name}-${Date.now()}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          imageUrls.push(downloadURL);
        }
    
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("size", formData.size);
        formDataToSend.append("medium", formData.medium);
        formDataToSend.append("surface", formData.surface);
        formDataToSend.append("artType", formData.artType);
        formDataToSend.append("creationYear", formData.creationYear);
        formDataToSend.append("quality", formData.quality);
        formDataToSend.append("delivery", formData.delivery);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("price", formData.price);
        imageUrls.forEach((url) => formDataToSend.append("artPhotoUrls", url));
    
        try {
          const response = await makeAuthenticatedMulterPostRequest(
            "/artwork/create",
            formDataToSend
          );
    
          if (response.error) {
            console.error("Error creating artwork", response.error);
            setUploadStatus("Upload Failed");
          } else {
            console.log("Artwork created successfully", response);
            setUploadStatus("Upload Complete");
          }
        } catch (error) {
          console.error("Error creating artwork", error);
          setUploadStatus("Upload Failed");
        }
      };

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
      <section className="flex flex-col bg-gray-50 min-h-screen">
      <NavBar />
      <div className="flex flex-col justify-center max-w-2xl mx-auto w-full p-6">
        <h1 className="mt-4 text-4xl font-extrabold text-center text-gray-800">
          Upload an ArtWork for Sale
        </h1>
        <div className="flex flex-col w-full mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col w-full space-y-6 bg-white p-6 rounded-lg shadow-lg">
            {/* Title */}
            <div className="form-control w-full">
              <label htmlFor="title" className="label">
                <span className="label-text text-lg font-semibold">Title:</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Title of the art"
                value={formData.title}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
              />
            </div>
    
            {/* Category */}
            <div className="form-control w-full">
              <label htmlFor="category" className="label">
                <span className="label-text text-lg font-semibold">Category</span>
              </label>
              <select
                name="category"
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select Category
                </option>
                {Collections.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
    
            {/* Artwork Size */}
            <div className="form-control w-full">
              <label htmlFor="size" className="label">
                <span className="label-text text-lg font-semibold">Artwork Size</span>
              </label>
              <input
                type="text"
                name="size"
                id="size"
                placeholder="e.g 16in x 20in"
                value={formData.size}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
              />
            </div>
    
            {/* Medium */}
            <div className="form-control w-full">
              <label htmlFor="medium" className="label">
                <span className="label-text text-lg font-semibold">Medium used</span>
              </label>
              <select
                name="medium"
                id="medium"
                value={formData.medium}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select Medium
                </option>
                {Materials.map((material, index) => (
                  <option key={index} value={material}>
                    {material}
                  </option>
                ))}
              </select>
            </div>
    
            {/* Surface */}
            <div className="form-control w-full">
              <label htmlFor="surface" className="label">
                <span className="label-text text-lg font-semibold">Surface used</span>
              </label>
              <select
                name="surface"
                id="surface"
                value={formData.surface}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select Surface
                </option>
                {Surfaces.map((surface, index) => (
                  <option key={index} value={surface}>
                    {surface}
                  </option>
                ))}
              </select>
            </div>
    
            {/* Art Type */}
            <div className="form-control w-full">
              <label htmlFor="artType" className="label">
                <span className="label-text text-lg font-semibold">ArtWork Type</span>
              </label>
              <select
                name="artType"
                id="artType"
                value={formData.artType}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select ArtWork Type
                </option>
                <option value="Original">Original</option>
                <option value="Copy">Copy</option>
              </select>
            </div>
    
            {/* Year of Creation */}
            <div className="form-control w-full">
              <label htmlFor="creationYear" className="label">
                <span className="label-text text-lg font-semibold">Year of Creation</span>
              </label>
              <input
                type="number"
                name="creationYear"
                id="creationYear"
                max="2023"
                min="0"
                placeholder="Year created..."
                value={formData.creationYear}
                onChange={handleChange}
                className="input input-bordered input-primary w-full"
              />
            </div>
    
            {/* Quality */}
            <div className="form-control w-full">
              <label htmlFor="quality" className="label">
                <span className="label-text text-lg font-semibold">Quality</span>
              </label>
              <select
                name="quality"
                id="quality"
                value={formData.quality}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select Quality
                </option>
                {Quality.map((quality, index) => (
                  <option key={index} value={quality}>
                    {quality}
                  </option>
                ))}
              </select>
            </div>
    
            {/* Delivery */}
            <div className="form-control w-full">
              <label htmlFor="delivery" className="label">
                <span className="label-text text-lg font-semibold">To be delivered as</span>
              </label>
              <select
                name="delivery"
                id="delivery"
                value={formData.delivery}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option disabled value="">
                  Select Delivery Form
                </option>
                <option value="Rolled">Rolled</option>
                <option value="Stretched">Stretched</option>
              </select>
            </div>
    
            {/* Description */}
            <div className="form-control w-full">
              <label htmlFor="description" className="label">
                <span className="label-text text-lg font-semibold">Description of the ArtWork</span>
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Description of the art..."
                value={formData.description}
                onChange={handleChange}
                className="textarea textarea-bordered textarea-primary w-full"
              />
            </div>
    
            {/* Art Photo */}
            <div className="form-control w-full">
              <label htmlFor="artPhoto" className="label">
                <span className="label-text text-lg font-semibold">Photos of the ArtWork</span>
              </label>
              <input
                type="file"
                id="artPhoto"
                name="artPhoto"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
              {formData.artPhoto.length > 0 && (
                <div className="mt-4">
                  <p className="text-lg font-medium">Selected Photos:</p>
                  <div className="flex flex-wrap gap-4">
                    {formData.artPhoto.map((file, index) => (
                      <img
                        key={index}
                        src={URL.createObjectURL(file)}
                        alt={`Artwork ${index + 1}`}
                        className="w-32 h-32 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
    
            {/* Price */}
            <div className="form-control w-full">
              <label htmlFor="price" className="label">
                <span className="label-text text-lg font-semibold">Price of the ArtWork</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="In Dollars..."
                className="input input-bordered input-primary w-full"
              />
            </div>
            <div  className="flex justify-cenyter items-center">
            {uploadStatus && (
              <div className="text-center text-red-500 mb-4 font-semibold text-lg">
                {uploadStatus}
              </div>
            )}
            </div>
    
            {/* Submit Button */}
            <div className="flex justify-center items-center">
              <button
                type="submit"
                className="btn btn-primary w-full font-semibold text-lg"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
    
    )
}
export default Product;