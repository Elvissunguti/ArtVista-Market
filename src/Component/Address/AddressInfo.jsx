import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import DashBoard from "../DashBoard/DashBoard";

const AddressInfo = () => {

    const [ addressInfo, setAddressInfo ] = useState([]);

    useEffect(() => {
        const fetchData = async() => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/address/fetch"
                );
                setAddressInfo(response.data);
            

            } catch(error){
                console.error("Error fetching address information:", error);
            }
        }
        fetchData();
    })

    return (
        <DashBoard>
            <div>
                <h1>Account overview</h1>
                <div>
                    <p>Account details</p>
                    <div>
                        <p>{addressInfo.firstName} {addressInfo.lastName}</p>
                        <p>{addressInfo.email}</p>
                    </div>
                </div>
                <div>
                    <p>Shipping address</p>
                    <Link to="/address/edit">
                    <MdEdit />
                    </Link>
                    <div>
                        <p>Your default shipping address:</p>
                        <p>{addressInfo.firstName} {addressInfo.lastName}</p>
                        <p>{addressInfo.address}</p>
                        <p>{addressInfo.city}</p>
                        <p>{addressInfo.phoneNumber}</p>

                    </div>
                </div>
                    

            </div>
        </DashBoard>
    )
}
export default AddressInfo;