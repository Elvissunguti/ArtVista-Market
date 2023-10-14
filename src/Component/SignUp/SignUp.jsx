import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { Images } from "../Utils/ArtData";
import { Link } from "react-router-dom";


function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }

const SignUp = () => {

    const [ userName, setUserName ] = useState("")
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");

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
        <section className="">
            <div className="flex justify-center my-16">
               <img 
                  src={logo}
                  alt="Logo image"
                  className="h-32 w-96"
                    />
            </div>
            <div className="flex flex-row">

                <div className="flex justify-end w-1/2">
                    <form className="flex flex-col justify-end mr-4 w-1/2 space-y-8 ">
                        <h1 className="text-2xl font-semibold tracking-tight text-green-600">Sign Up</h1>
                        <div>
                          <label htmlFor="userName" className="flex flex-start block font-bold text-lg">
                            Username
                          </label>  
                        <input 
                           type="name"
                           name="name"
                           id="userName"
                           value={userName}
                           placeholder="Enter username"
                           required
                           onClick={(e) => setUserName(e.target.value)}
                           className="block relative w-full px-3 py-2 rounded-none rounded-t-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        </div>
                        <div>
                            <label htmlFor="email" className="flex flex-start block font-bold text-lg">
                                Enter
                            </label>
                        <input
                           type="email"
                           name="email"
                           id="email"
                           value={email}
                           placeholder="Enter Email address"
                           required
                           onClick={(e) => setEmail(e.target.value)}
                           className="block relative w-full px-3 py-2 rounded-none rounded-t-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        </div>
                        <div>
                            <label htmlFor="password" className="flex flex-start block font-bold text-lg">
                                Password
                            </label>
                        <input
                           type="password"
                           name="password"
                           id="password"
                           value={password}
                           placeholder="Enter password"
                           required
                           onClick={(e) => setPassword(e.target.value)}
                           className="block relative w-full px-3 py-2 rounded-none rounded-t-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="flex flex-start block font-bold text-lg">
                                Confirm password
                            </label>
                        <input 
                           type="password"
                           name="password"
                           id="confirmPassword"
                           value={confirmPassword}
                           required
                           placeholder="Confirm password"
                           onClick={(e) => setConfirmPassword(e.target.value)}
                           className="block relative w-full px-3 py-2 rounded-none rounded-t-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        </div>
                        <div>
                        <button type="submit" className="px-2 py-3 bg-green-500 hover:bg-green-700 text-white shadow-xl rounded">
                            Sign up
                        </button>
                        </div>
                        <div className="mb-8">
                        <p>Already have an account? <Link to="/login"><span className="text-red-500">Login</span></Link></p>
                        </div>
                    </form>
                </div>
                <div className="w-1/2 ml-4">
                    <img
                       src={Images[firstImageIndex]}
                       alt="Images of art"
                       className="w-1/2 h-64 rounded-md shadow-xl"

                    />
                    <img 
                       src={Images[secondImageIndex]} 
                       alt="Images of art"
                       className="w-1/2 h-64 rounded-md shadow-xl"
                    />
                </div>
            </div>
        </section>
    )
}
export default SignUp;