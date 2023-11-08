import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest, makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";

const ProfileUpload = () => {

    const [ formData, setFormData ] = useState({
        profilePic: "",
        location: "",
        description: ""
    });
    const [ profile, setProfile ] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/profile/get/profile"
                );
                setProfile(response.data);
            } catch(error){
                console.error("Error in fetching profile:", error)
            }
        }
        fetchData();
    }, []);


    useEffect(() => {
        if (profile) {
          setFormData({
            profilePic: profile.profilePic || "",
            location: profile.location || "",
            description: profile.description || ""
          });
        }
      }, [profile]);

      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const formDataToSend = new FormData();
    
        // Append data to the FormData object
        formDataToSend.append("profilePic", formData.profilePic);
        formDataToSend.append("location", formData.location);
        formDataToSend.append("description", formData.description);
    
        try {
          const response = await makeAuthenticatedMulterPostRequest("/profile/create", formDataToSend);
          if (response.error) {
            console.error("Error creating or updating user profile", response.error);
          } else {
            console.log("User profile created or updated successfully", response);
          }
        } catch (error) {
          console.error("Error creating or updating user profile", error);
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
          profilePic: file,
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
                       value={formData.location}
                       className=""

                    />
                    <label htmlFor="description" className="text-2xl font-semibold">How can you describe yourself as an artist?</label>
                    <textarea 
                       id="description"
                       name="description"
                       placeholder="Description of the artist"
                       onChange={handleChange}
                       value={formData.description}
                       className=""
                    />
                    <div>
                        <button type="submit" className="flex justify-center font-medium text-white mt-7 px-2 py-3 rounded-lg bg-green-500 hover:bg-green-800 border-transparent focus:outline-none focus:ring-2 focus:ring-[#40AA54]-500 focus:ring-offset-2 cursor-pointer">
                           {profile ? "UPDATE" : "SUBMIT"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
};
export default ProfileUpload;