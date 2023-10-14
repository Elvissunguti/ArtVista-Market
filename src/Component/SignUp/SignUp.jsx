import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { Images } from "../Utils/ArtData";


function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }

const SignUp = () => {

    const [firstImageIndex, setFirstImageIndex] = useState(getRandomIndex(Images.length));
    const [secondImageIndex, setSecondImageIndex] = useState(getRandomIndex(Images.length));

    useEffect(() => {
        // Change the images randomly every 5 seconds (5000 milliseconds)
        const interval = setInterval(() => {
          setFirstImageIndex(getRandomIndex(Images.length));
          setSecondImageIndex(getRandomIndex(Images.length));
        }, 5000);
    
        return () => {
          clearInterval(interval); // Cleanup the interval on unmount
        };
      }, []);


    return (
        <section>
               <img 
                  src={logo}
                  alt="Logo image"
                  className=""
                    />
            <div className="flex flex-col">

                <div className="flex flex-col w-1/2">
                    <h1>Sign Up</h1>
                    <form className="flex flex-col ">
                        <input 
                           type="name"
                           name="name"
                           placeholder="Enter Full name"
                           required
                           className=""
                        />
                        <input
                           type="email"
                           name="email"
                           placeholder="Enter Email address"
                           required
                           className=""
                        />
                        <input
                           type="password"
                           name="password"
                           placeholder="Enter password"
                           required
                           className=""
                        />
                        <input 
                           type="password"
                           name="password"
                           required
                           placeholder="Confirm password"
                           className=""
                        />
                        <button type="submit" className="bg-green-500 text-white">
                            Sign up
                        </button >
                        <p>Already have an account? Login here</p>
                    </form>
                </div>
                <div>
                    <img
                       src={Images[firstImageIndex]}
                       alt="Images of art"

                    />
                    <img 
                       src={Images[secondImageIndex]} 
                       alt="Images of art"
                    />
                </div>
            </div>
        </section>
    )
}
export default SignUp;