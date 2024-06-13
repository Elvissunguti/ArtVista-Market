import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { Images } from "../Utils/ArtData";
import { Link, useNavigate } from "react-router-dom";
import { makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import Cookies from "js-cookie";

import { useAuth } from "../Context/AuthContext";


function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
  }

const Login = () => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("");
    const [firstImageIndex, setFirstImageIndex] = useState(getRandomIndex(Images.length));
    const [secondImageIndex, setSecondImageIndex] = useState(getRandomIndex(Images.length));

    const { handleLogin } = useAuth();
    const navigate = useNavigate();

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


      const handleLogins = async(e) => { 
        e.preventDefault();

        const userData = {
            email: email,
            password: password
        };

        try{
            const response = await makeAuthenticatedPOSTRequest(
                "/auth/login", userData
            );
            if (response.message === "Login successfull" && response.token) {
                const token = response.token;
            Cookies.set("token", token, { expires: 7 });

            handleLogin();
                // user logged in successfull

                navigate("/");
                console.log("User Signed up successfully");
            } else{
                console.error("Sign up failed");
                setError("Wrong Email or password");
            }

        } catch(error){
            console.error("Error logging in:", error);
        }
      };

      const handleGoogleLogin = () => {
        // Redirect to the Google login route
        window.location.href = "http://localhost:8080/auth/google";
      };


    return (
        <section className="">
            <div className="flex justify-center my-16">
               <img 
                  src={logo}
                  alt="Logo"
                  className="h-32 w-96"
                    />
            </div>
            <div className="flex flex-row ">
                <div className="flex justify-end w-1/2">
            <div className="flex flex-col justify-end w-1/2 mr-4">
                    <img
                       src={Images[firstImageIndex]}
                       alt="Images of art"
                       className="w-full h-48 rounded-md shadow-xl"

                    />
                    <img 
                       src={Images[secondImageIndex]} 
                       alt="Images of art"
                       className="w-full h-48 rounded-md shadow-xl"
                    />
                </div>
                </div>

                <div className="flex w-1/2">
                    <form className="flex flex-col ml-4 w-1/2 space-y-8" onSubmit={handleLogins}>
                        <h1 className="text-2xl font-semibold tracking-tight text-green-600">Login</h1>
                        <div>
                            <label htmlFor="email" className="flex flex-start block font-bold text-lg">
                                Email
                            </label>
                        <input
                           type="email"
                           name="email"
                           id="email"
                           value={email}
                           placeholder="Enter Email address"
                           required
                           onChange={(e) => setEmail(e.target.value)}
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
                           onChange={(e) => setPassword(e.target.value)}
                           className="block relative w-full px-3 py-2 rounded-none rounded-t-md border border-gray-300 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                        />
                        </div>
                        <div className="text-center  font-medium text-red-600 md:text-lg my-2">
                                <p>{error}</p>
                        </div>
                        <div>
                        <button type="submit" className="px-2 py-3 bg-green-500 hover:bg-green-700 text-lg text-white shadow-xl rounded">
                            Login
                        </button>
                        </div>
                        <div className="mb-8">
                        <p>Don't have an account? <Link to="/sign up"><span className="text-red-500">Sign up</span></Link>

                        </p>
                        </div>
                    </form>
                    <button
          onClick={handleGoogleLogin}
          className="bg-red-600 text-white px-4 py-2 rounded-md mt-4 w-full hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Login with Google
        </button>
                </div>

            </div>
        </section>
    )
}
export default Login;