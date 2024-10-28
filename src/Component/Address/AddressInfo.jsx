import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { MdEdit } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import DashBoard from "../DashBoard/DashBoard";

const AddressInfo = () => {
    const [addressInfo, setAddressInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest("/address/fetch");
                setAddressInfo(response.data);
            } catch (error) {
                console.error("Error fetching address information:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <DashBoard>
            <div className="p-4">
                <h1 className="text-3xl font-semibold mb-6 text-center">Account Overview</h1>

                {/* Account Details Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-3">Account Details</h2>
                    <div className="border border-gray-200 p-4 rounded-md bg-base-100 shadow">
                        <p className="text-lg font-medium mb-1">
                            {addressInfo?.firstName} {addressInfo?.lastName || "Not Set"}
                        </p>
                        <p className="text-gray-600">{addressInfo?.email || "Address not available"}</p>
                    </div>
                </div>

                {/* Shipping Address Section */}
                <div>
                    <h2 className="text-xl font-semibold mb-3">Shipping Address</h2>
                    <div className="flex items-center mb-4">
                        <p className="mr-2 text-gray-700">Your default shipping address:</p>
                        <Link to="/address/edit" className="text-blue-500 hover:text-blue-600">
                            <MdEdit className="inline-block" />
                        </Link>
                    </div>

                    {/* Address Display or Set Address Prompt */}
                    <div className="border border-gray-200 p-4 rounded-md bg-base-100 shadow">
                        {addressInfo && addressInfo.firstName ? (
                            <>
                                <p className="text-lg font-medium mb-1">
                                    {addressInfo.firstName} {addressInfo.lastName}
                                </p>
                                <p className="text-gray-700 mb-1">{addressInfo.address}</p>
                                <p className="text-gray-700 mb-1">{addressInfo.city}</p>
                                <p className="text-gray-700">{addressInfo.phoneNumber}</p>
                            </>
                        ) : (
                            <div className="text-gray-600">
                                <p className="mb-2">Address not yet set.</p>
                                <button
                                    onClick={() => navigate("/address/edit")}
                                    className="btn btn-sm btn-primary text-white bg-blue-500 hover:bg-blue-600"
                                >
                                    Set Address
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashBoard>
    );
};

export default AddressInfo;
