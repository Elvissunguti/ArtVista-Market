import React, { useEffect, useState } from "react";
import NavBar from "../Home/NavBar";
import { makeAuthenticatedGETRequest, makeAuthenticatedMulterPostRequest } from "../Utils/Helpers";
import { storage } from "../Utils/Firebase"; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const ProfileUpload = () => {
    const [formData, setFormData] = useState({
        profilePic: "",
        location: "",
        description: ""
    });
    const [profile, setProfile] = useState(null);
    const [uploading, setUploading] = useState(false); // Track upload status

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/profile/get/profile");
                setProfile(response.data);
            } catch (error) {
                console.error("Error in fetching profile:", error);
            }
        };
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

        // If a new profile picture is selected, upload it to Firebase Storage
        if (formData.profilePic && typeof formData.profilePic !== "string") {
            setUploading(true);
            const file = formData.profilePic;
            const storageRef = storage.ref(`profile_pictures/${file.name}`);

            try {
                // Upload file
                const uploadTaskSnapshot = await storageRef.put(file);
                // Get URL
                const downloadURL = await uploadTaskSnapshot.ref.getDownloadURL();

                // Update formData with the download URL
                formData.profilePic = downloadURL;
            } catch (error) {
                console.error("Error uploading profile picture:", error);
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        // Send the updated formData with the profilePic URL
        const formDataToSend = new FormData();
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
                    <label htmlFor="location" className="text-2xl font-semibold">Location</label>
                    <input
                       type="text"
                       name="location"
                       id="location"
                       placeholder="1115 Saika, Nairobi Kenya"
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
                        <button 
                           type="submit" 
                           className="flex justify-center font-medium text-white mt-7 px-2 py-3 rounded-lg bg-green-500 hover:bg-green-800 border-transparent focus:outline-none focus:ring-2 focus:ring-[#40AA54]-500 focus:ring-offset-2 cursor-pointer"
                           disabled={uploading}
                        >
                           {uploading ? "Uploading..." : profile ? "UPDATE" : "SUBMIT"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default ProfileUpload;
