import React, { useState } from "react";
import { makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import DashBoard from "../DashBoard/DashBoard";

const AddressEdit = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        address: "",
        moreInfo: "",
        region: "",
        city: "",
    });

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        try {
            const response = await makeAuthenticatedPOSTRequest(
              "/address/createOrUpdate", formData
              );
            console.log("Address saved successfully");
            window.alert("Address saved successfully");
        } catch (error) {
            console.error("Error saving address information", error);
        }
    };

    return (
        <DashBoard>
            <div className="p-4">
                <h1 className="text-3xl font-semibold mb-6">Edit Address</h1>
                <form onSubmit={handleSaveAddress} className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className="block">First Name</label>
                        <input 
                            type="text"
                            id="firstName"
                            name="firstName"
                            placeholder="Enter First Name"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block">Last Name</label>
                        <input 
                            type="text"
                            id="lastName"
                            name="lastName"
                            placeholder="Enter Last Name"
                            value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phoneNumber" className="block">Phone Number</label>
                        <input 
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            placeholder="Enter Phone Number"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="address" className="block">Address</label>
                        <input 
                            type="text"
                            id="address"
                            name="address"
                            placeholder="Enter Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="moreInfo" className="block">Additional Information</label>
                        <input 
                            type="text"
                            id="moreInfo"
                            name="moreInfo"
                            placeholder="Enter Additional Information"
                            value={formData.moreInfo}
                            onChange={(e) => setFormData({ ...formData, moreInfo: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="region" className="block">Region</label>
                        <input 
                            type="text"
                            id="region"
                            name="region"
                            placeholder="Enter Region"
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="city" className="block">City</label>
                        <input 
                            type="text"
                            id="city"
                            name="city"
                            placeholder="Enter City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full px-4 py-3 text-white bg-[#9A7B4F] rounded-md hover:bg-[#7F5F3D] focus:outline-none focus:bg-[#7F5F3D]"
                    >
                        SAVE
                    </button>
                </form>
            </div>
        </DashBoard>
    );
};

export default AddressEdit;
