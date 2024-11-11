import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { Images } from "../Utils/ArtData";
import { Link, useNavigate } from "react-router-dom";
import { makeAuthenticatedPOSTRequest } from "../Utils/Helpers";
import Cookies from "js-cookie";
import { useAuth } from "../Context/AuthContext";

// Helper function to get a random index
function getRandomIndex(max, exclude) {
  let index;
  do {
    index = Math.floor(Math.random() * max);
  } while (index === exclude); // Ensure the new index is not the same as the excluded one
  return index;
}

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [firstImageIndex, setFirstImageIndex] = useState(getRandomIndex(Images.length, -1));
  const [secondImageIndex, setSecondImageIndex] = useState(getRandomIndex(Images.length, firstImageIndex));
  
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  // Change images at intervals, ensuring they're different
  useEffect(() => {
    const changeFirstImage = setInterval(() => {
      setFirstImageIndex((prevIndex) => getRandomIndex(Images.length, prevIndex));
    }, 5000); // Change every 5 seconds

    const changeSecondImage = setInterval(() => {
      setSecondImageIndex((prevIndex) => {
        let newIndex = getRandomIndex(Images.length, prevIndex);
        while (newIndex === firstImageIndex) {
          newIndex = getRandomIndex(Images.length, prevIndex);
        }
        return newIndex;
      });
    }, 10000); // Change every 10 seconds

    return () => {
      clearInterval(changeFirstImage);
      clearInterval(changeSecondImage);
    };
  }, [firstImageIndex]);

  // Handle form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    const userData = {
      userName: userName,
      email: email,
      password: password,
    };

    try {
      const response = await makeAuthenticatedPOSTRequest("/auth/signup", userData);
      if (response.message === "User created Successfully") {
        const token = response.token;
        Cookies.set("token", token, { expires: 7 });
        handleLogin();
        navigate("/");
      } else {
        setError("Error creating a new user");
      }
    } catch (error) {
      console.error("Error signing up new User:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://api-avfkvnhjaq-uc.a.run.app/auth/google";
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-full max-w-4xl p-6 lg:p-12 ">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-24 w-auto" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">

          {/* Form Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Sign Up</h2>
            <form className="space-y-6" onSubmit={handleSignUp}>
              <div>
                <label htmlFor="userName" className="block font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter username"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              {error && (
                <p className="text-red-500 text-center font-semibold">{error}</p>
              )}
              <button type="submit" className="btn btn-primary w-full">Sign up</button>
              <div className="divider">OR</div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn bg-red-600 hover:bg-red-700 w-full text-white"
              >
                Sign up with Google
              </button>
            </form>
            <p className="text-center mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            </p>
          </div>

          {/* Image Section */}
          <div className="hidden lg:flex flex-col space-y-6 w-full lg:w-1/2">
            <div className="flex justify-center">
              <img
                src={Images[firstImageIndex]}
                alt="Art"
                className="w-3/4 h-72 rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={Images[secondImageIndex]}
                alt="Art"
                className="w-3/4 h-72 rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SignUp;
