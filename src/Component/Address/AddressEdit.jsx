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
        e.preventDefault()
        try{
            const response = await makeAuthenticatedPOSTRequest(
                "/address/createOrUpdate",
                formData
            );

            console.log("Address saved successfully");
            window.alert("Address saved successfully");

        } catch(error){
            console.log("Error saving address information", error);
        }

    }

    return (
        <DashBoard>
            <div>
                <h1>Edit Address</h1>
                <form onSubmit={handleSaveAddress} className>
                    <label>First Name</label>
                    <input 
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Enter firstName"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className=""
                    />

                    <label>Last Name</label>
                    <input 
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Enter lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className=""
                    />

                    <label>Phone number</label>
                    <input 
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      placeholder="Enter phone number"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className=""
                    />

                    <label>Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="enter address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className=""
                    />

                    <label>Additional Information</label>
                    <input 
                      type="text"
                      id="moreInfo"
                      name="moreInfo"
                      placeholder="Enter additional information"
                      value={formData.moreInfo}
                      onChange={(e) => setFormData({ ...formData, moreInfo: e.target.value })}
                      className=""
                    />

                    <label>Region</label>
                    <input 
                      type="text"
                      id="region"
                      name="region"
                      placeholder="Enter Region"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      className=""
                    />

                    <label>City</label>
                    <input 
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className=""
                    />

                    <button type="submit" className="px-2 py-3 text-white bg-[#9A7B4F]">
                        SAVE
                    </button>

                </form>
            </div>
        </DashBoard>
    )
}
export default AddressEdit;