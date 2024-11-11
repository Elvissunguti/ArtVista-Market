import React, { useState } from "react";
import { makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import DashBoard from "../DashBoard/DashBoard";
import { MdCheckCircle, MdError } from "react-icons/md";

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
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ show: false, success: true, message: "" });

    const handleSaveAddress = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        setStatusMessage({ show: false, success: true, message: "" });

        try {
            await makeAuthenticatedPOSTRequest("/address/createOrUpdate", formData);
            setStatusMessage({ show: true, success: true, message: "Address saved successfully!" });
        } catch (error) {
            console.error("Error saving address information", error);
            setStatusMessage({ show: true, success: false, message: "Failed to save address. Please try again." });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <DashBoard>
            <div className="bg-base-100 rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold text-neutral text-main mb-6 text-center">Edit Address</h1>

                <form onSubmit={handleSaveAddress} className="space-y-6">
                    {[
                        { id: "firstName", label: "First Name" },
                        { id: "lastName", label: "Last Name" },
                        { id: "phoneNumber", label: "Phone Number" },
                        { id: "address", label: "Address" },
                        { id: "moreInfo", label: "Additional Information" },
                        { id: "region", label: "Region" },
                        { id: "city", label: "City" },
                    ].map(({ id, label }) => (
                        <div key={id} className="form-control">
                            <label htmlFor={id} className="label text-lg font-medium text-gray-600">
                                {label}
                            </label>
                            <input
                                type="text"
                                id={id}
                                name={id}
                                placeholder={`Enter ${label}`}
                                value={formData[id]}
                                onChange={(e) => setFormData({ ...formData, [id]: e.target.value })}
                                className="input input-bordered w-full focus:outline-none focus:ring-2 focus:ring-[#9A7B4F] text-gray-700"
                            />
                        </div>
                    ))}

                    <button
                        type="submit"
                        className={`btn w-full bg-[#9A7B4F] hover:bg-[#7F5F3D] text-white font-semibold py-3 rounded-md transition duration-300 ${isSaving ? "loading" : ""}`}
                        disabled={isSaving}
                    >
                        {isSaving ? "SAVING..." : "SAVE"}
                    </button>
                </form>

                {statusMessage.show && (
                    <div className={`fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50`}>
                        <div className="bg-white p-6 rounded-md shadow-lg w-96 text-center">
                            <div className="flex items-center justify-center space-x-2 mb-4">
                                {statusMessage.success ? (
                                    <MdCheckCircle className="text-green-600 text-3xl" />
                                ) : (
                                    <MdError className="text-red-600 text-3xl" />
                                )}
                                <h3 className={`text-lg font-semibold ${statusMessage.success ? "text-green-600" : "text-red-600"}`}>
                                    {statusMessage.message}
                                </h3>
                            </div>
                            <button
                                onClick={() => setStatusMessage({ ...statusMessage, show: false })}
                                className="mt-4 btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </DashBoard>
    );
};

export default AddressEdit;
