import React from "react";
import { PiCertificateThin, PiKeyReturnThin } from "react-icons/pi";

const Details = ({ size, medium, surface, artType, creationYear, quality, delivery }) => {
    return (
        <section>
            <div className="flex flex-col items-start space-y-5">
                <p>Size: {size}</p>
                <p>Medium: {medium}</p>
                <p>Surface: {surface}</p>
                <p>Artwork: {artType}</p>
                <p>Created in: {creationYear}</p>
                <p>Quality: {quality}</p>
                <p>To be delivered as: {delivery}</p>
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