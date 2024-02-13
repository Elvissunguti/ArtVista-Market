import React, { useEffect, useState } from "react";
import { makeAuthenticatedGETRequest } from "../Utils/Helpers";

const SentOrder = () => {

    const [ order, setOrder ] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try{
                const response = await makeAuthenticatedGETRequest(
                    "/order/myorders"
                );
                setOrder(response.data)

            } catch(error){
                console.error("Error fetching ordered artwork:", error)
            }

        } 
        fetchData();
    }, []);

    
    return (
        <section>
            <div>

            </div>
        </section>
    )
}

export default SentOrder;