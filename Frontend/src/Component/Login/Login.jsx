import React, { useEffect, useState } from "react";
import logo from "../../Assets/logo/logo-no-background.png";
import { Images } from "../Utils/ArtData";
import { Link, useNavigate } from "react-router-dom";
import { makeUnauthenticatedPOSTRequest } from "../Utils/Helpers";
import Cookies from "js-cookie";
import { useAuth } from "../Context/AuthContext";

// Function to get a random index excluding the current index to prevent repetition
function getRandomIndex(max, exclude) {
  let index;
  do {
    index = Math.floor(Math.random() * max);
  } while (index === exclude);
  return index;
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstImageIndex, setFirstImageIndex] = useState(getRandomIndex(Images.length, -1));
  const [secondImageIndex, setSecondImageIndex] = useState(getRandomIndex(Images.length, firstImageIndex));
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  // Ensure the images change at different intervals
  useEffect(() => {
    const changeFirstImage = setInterval(() => {
      setFirstImageIndex((prevIndex) => getRandomIndex(Images.length, prevIndex));
    }, 5000); // Change the first image every 5 seconds

    const changeSecondImage = setInterval(() => {
      // Ensure the second image is not the same as the first
      setSecondImageIndex((prevIndex) => {
        let newIndex = getRandomIndex(Images.length, prevIndex);
        // Prevent both images from being the same
        while (newIndex === firstImageIndex) {
          newIndex = getRandomIndex(Images.length, prevIndex);
        }
        return newIndex;
      });
    }, 10000); // Change the second image every 10 seconds

    return () => {
      clearInterval(changeFirstImage);
      clearInterval(changeSecondImage);
    };
  }, [firstImageIndex]); // Depend on `firstImageIndex` to ensure no repetition

  const handleLogins = async (e) => {
    e.preventDefault();
    const userData = { email: email, password: password };

    try {
      const response = await makeUnauthenticatedPOSTRequest("/auth/login", userData);
      if (response.message === "Login successfull" && response.token) {
        const token = response.token;
        Cookies.set("token", token, { expires: 7 });
        handleLogin();
        navigate("/");
      } else {
        setError("Wrong Email or Password");
        
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://api-avfkvnhjaq-uc.a.run.app/auth/google";
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex justify-center items-center">
      <div className="w-full max-w-4xl mx-auto p-6 lg:p-12">
        <div className="flex justify-center mb-8">
          <img src={logo} alt="Logo" className="h-24 w-auto" />
        </div>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
          {/* Image Section */}
          <div className="hidden lg:flex flex-col space-y-6 w-1/2">
            <div className="flex justify-center">
              <img
                src={Images[firstImageIndex]}
                alt="Art"
                className="w-5/6 h-56 rounded-xl shadow-lg object-cover"
              />
            </div>
            <div className="flex justify-center">
              <img
                src={Images[secondImageIndex]}
                alt="Art"
                className="w-5/6 h-56 rounded-xl shadow-lg object-cover"
              />
            </div>
          </div>

          {/* Form Section */}
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-green-600 mb-6">Login to Your Account</h2>
            <form className="space-y-6" onSubmit={handleLogins}>
              <div>
                <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
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
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="input input-bordered w-full"
                />
              </div>
              {error && (
                <p className="text-red-500 text-center font-semibold">{error}</p>
              )}
              <div>
                <button type="submit" className="btn btn-primary w-full">Login</button>
              </div>
              <div className="divider">OR</div>
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="btn bg-red-600 hover:bg-red-700 w-full text-white"
              >
                Login with Google
              </button>
            </form>
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <Link to="/sign-up" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
 