import React from "react";
import { PiCertificateThin, PiKeyReturnThin } from "react-icons/pi";

const Details = () => {
    return (
        <section>
            <div>
                <p>Size:</p>
                <p>Medium:</p>
                <p>Surface:</p>
                <p>Artwork:</p>
                <p>Created in:</p>
                <p>Quality:</p>
                <p>To be delivered as:</p>
                <div>
                    <PiCertificateThin />
                    <p>Artist Sign and Certificate Provided</p>
                </div>
                <div>
                    <PiKeyReturnThin />
                    <p>Return Policy: <span>7 days applicable from delivery date.</span></p>
                </div>
            </div>
        </section>
    )
}
export default Details;