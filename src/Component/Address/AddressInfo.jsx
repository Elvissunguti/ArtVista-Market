import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import DashBoard from "../DashBoard/DashBoard";

const AddressInfo = () => {
    const [addressInfo, setAddressInfo] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await makeAuthenticatedGETRequest(
                    "/address/fetch"
                    );
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
                <h1 className="text-3xl font-semibold mb-4">Account Overview</h1>
                <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-2">Account Details</h2>
                    <div className="border border-gray-200 p-4 rounded-md">
                        <p className="mb-2">{addressInfo?.firstName} {addressInfo?.lastName}</p>
                        <p>{addressInfo?.email}</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
                    <div className="flex items-center mb-4">
                        <p className="mr-2">Your default shipping address:</p>
                        <Link to="/address/edit" className="text-blue-500">
                            <MdEdit />
                        </Link>
                    </div>
                    <div className="border border-gray-200 p-4 rounded-md">
                        <p className="mb-2">{addressInfo?.firstName} {addressInfo?.lastName}</p>
                        <p className="mb-2">{addressInfo?.address}</p>
                        <p className="mb-2">{addressInfo?.city}</p>
                        <p>{addressInfo?.phoneNumber}</p>
                    </div>
                </div>
            </div>
        </DashBoard>
    );
};

export default AddressInfo;
