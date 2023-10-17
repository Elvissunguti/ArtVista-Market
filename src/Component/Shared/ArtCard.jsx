import React from "react";
import art from "../../Assets/art Images/art 6.webp";


const ArtCard = () => {
    return (
        <section>
            <div>
                <div>
                    <img 
                       src={art}
                       alt="image of art"
                       className="w-48 h-48"
                    />
                    <p>Add </p>
                    <div>
                        <p>"Title"</p>
                        <p>Price</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
export default ArtCard;