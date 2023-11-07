import React, { useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";

const ProfileUpload = () => {

    const [ formData, setFormData ] = useState({
        profilePic: "",
        location: "",
        description: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();

        for (const key in formData) {
        if (key === "profilePic") {
        formDataToSend.append(key, formData[key]);
        } else {
        formDataToSend.append(key, formData[key]);
         }
        }

        try{
            const response = await makeAuthenticatedMulterPostRequest(
                "/profile/create", formDataToSend
            );
            if (response.error) {
                // Handle the error
                console.error("Error creating artwork", response.error);
              } else {
                // Handle the successful response
                console.log("Artwork created successfully", response);
              }

        } catch (error){
            console.log("Error uploading profile:", error);
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
        const file = e.target.files[0]; 
      
        setFormData({
          ...formData,
          artPhoto: file,
        });
      };


    return (
        <section>
            <NavBar />
            <div>
                <form onSubmit={handleSubmit} className="flex flex-col ">
                    <label htmlFor="profilePic" className="text-2xl font-semibold">Choose Profile Pic</label>
                    <input 
                       type="file"
                       name="profilePic"
                       id="profilePic"
                       accept="image/*"
                       onChange={handleFileChange}
                       className=""
                    />
                    <label htmlFor="location" className="text-2xl font-semibold">location</label>
                    <input
                       type="text"
                       name="location"
                       id="location"
                       placeholder="1115 saika, Nairobi Kenya"
                       onChange={handleChange}
                       className=""

                    />
                    <label htmlFor="description" className="text-2xl font-semibold">How can you describe yourself as an artist?</label>
                    <textarea 
                       id="description"
                       name="description"
                       placeholder="Description of the artist"
                       onChange={handleChange}
                       className=""
                    />
                    <div>
                        <button type="submit" className="flex justify-center font-medium text-white mt-7 px-2 py-3 rounded-lg bg-green-500 hover:bg-green-800 border-transparent focus:outline-none focus:ring-2 focus:ring-[#40AA54]-500 focus:ring-offset-2 cursor-pointer">
                            SUBMIT
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
};
export default ProfileUpload;