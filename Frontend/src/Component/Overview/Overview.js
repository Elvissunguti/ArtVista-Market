import React, { useState, useEffect } from 'react';
import { makeUnAuthenticatedGETRequest } from "../Utils/Helpers";
import logo from "../../Assets/logo/logo-no-background.png";
import { Link } from "react-router-dom";
import galleryBanner from "../../Assets/galleryBanner.webp";
import artworkGridBackground from "../../Assets/artworkgridBg.webp";


const Overview = () => {
    const [artworks, setArtworks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isNavbarFixed, setIsNavbarFixed] = useState(false);

    useEffect(() => {
        const fetchArtworks = async () => {
            try {
                const response = await makeUnAuthenticatedGETRequest('/artwork/overview');
                setArtworks(response.data);
            } catch (error) {
                console.error("Error fetching artworks:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArtworks();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.pageYOffset;
            setIsNavbarFixed(currentScrollPos > 50);
        };
    
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="bg-gray-100 text-gray-900">
            {/* Header */}
            <header className={`${
                isNavbarFixed ? "fixed top-0 left-0 right-0 z-50 shadow-lg bg-opacity-90 backdrop-blur-md" : "relative"
            } transition-all duration-300  bg-gray-900 text-white`}>
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <Link to="/">
                        <img src={logo} alt="App logo" className="w-32 h-10" />
                    </Link>
                    <nav className="flex items-center space-x-6 px-4  text-lg">
    <Link to="/shop" className="hover:text-main transition-colors duration-200">Shop</Link>
    <Link to="/about" className="hover:text-main transition-colors duration-200">About</Link>
    <Link to="/contact" className="hover:text-main transition-colors duration-200">Contact</Link>

    {/* Login Button with Outline and Hover Effect */}
    <Link 
        to="/login" 
        className="px-4 py-1.5 border border-white rounded-full text-white bg-[#9A7B4F]  transition-all duration-200 ease-in-out transform hover:scale-105"
    >
        Login
    </Link>

    {/* Register Button with Gradient Background */}
    <Link 
        to="/sign_up" 
        className="px-5 py-1.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
    >
        Register
    </Link>
</nav>

                </div>
            </header>

            {/* Banner */}
            <section 
    className="relative bg-cover bg-center h-80 flex items-center justify-center text-center text-white"
    style={{ backgroundImage: `url(${galleryBanner})` }}
>
<div className="absolute inset-0 bg-black opacity-30"></div>
    <div className="relative px-6 py-8 text-black rounded-md">
        <h1 className="text-4xl font-bold mb-4">Discover Exquisite Artworks</h1>
        <p className="mb-6 text-lg">Browse and purchase fine art from talented creators worldwide</p>
        <Link to="/login"><button className="px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg hover:bg-blue-700 transition-all">
            Shop Now
        </button></Link>
    </div>
</section>

            {/* Category Navigation */}
            <div className="container mx-auto p-8">
                <h2 className="text-3xl font-bold text-center mb-6">Browse Categories</h2>
                <div className="flex justify-center space-x-6">
                    {["Painting", "Sculpture", "Digital Art"].map((category) => (
                       <Link to="/login"><button key={category} className="px-6 py-3 border border-[#9A7B4F] text-blue-500 rounded-full hover:bg-[#9A7B4F] hover:text-white transition">
                            {category}
                        </button></Link>
                    ))}
                </div>
            </div>

            {/* Artwork Grid */}
            <section 
    className="relative grid gap-6 p-6 lg:grid-cols-3 md:grid-cols-2 bg-cover bg-center"
    style={{ backgroundImage: `url(${artworkGridBackground})` }}
>
<div className="absolute inset-0 bg-black opacity-30"></div>
{loading ? (
                    // Skeleton Loaders
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="p-4 bg-gray-200 border rounded-lg shadow-md animate-pulse">
                            <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div> {/* Image Skeleton */}
                            <div className="h-6 bg-gray-300 rounded mb-2"></div> {/* Title Skeleton */}
                            <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div> {/* Category Skeleton */}
                            <div className="h-6 bg-gray-300 rounded w-1/3"></div> {/* Price Skeleton */}
                        </div>
                    ))
                ) : (
                    artworks.map((artwork) => (
                        <div key={artwork._id} className="p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                            <img src={artwork.artPhoto[0]} alt={artwork.title} className="w-full h-48 object-cover rounded-lg" />
                            <h3 className="mt-2 text-lg font-semibold">{artwork.title}</h3>
                            <p className="text-gray-500">{artwork.category}</p>
                            <p className="text-gray-800 font-bold">${artwork.price}</p>
                            <button className="mt-2 w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-700 transition-all">
                                Add to Cart
                            </button>
                        </div>
                    ))
                )}
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-10 mt-12">
  <div className="container mx-auto grid lg:grid-cols-3 md:grid-cols-2 gap-8 px-6">
    {/* Branding and Description */}
    <div>
      <h4 className="text-2xl font-bold text-white mb-2">ARTVISTA MARKET</h4>
      <p className="text-gray-400">Your destination for high-quality artwork by independent artists worldwide.</p>
    </div>

    {/* Quick Links */}
    <div>
      <h5 className="text-lg font-semibold text-white mb-4">Quick Links</h5>
      <nav className="space-y-2">
        <Link to="/shop" className="block hover:text-primary transition">Shop</Link>
        <Link to="/about" className="block hover:text-primary transition">About Us</Link>
        <Link to="/contact" className="block hover:text-primary transition">Contact</Link>
        <Link to="/terms" className="block hover:text-primary transition">Terms of Service</Link>
        <Link to="/privacy" className="block hover:text-primary transition">Privacy Policy</Link>
      </nav>
    </div>

    {/* Social Media and Newsletter */}
    <div>
      <h5 className="text-lg font-semibold text-white mb-4">Stay Connected</h5>
      <div className="flex space-x-4 mb-4">
        <a href="https://facebook.com" className="text-2xl text-gray-400 hover:text-blue-500 transition">
          <i className="fab fa-facebook"></i>
        </a>
        <a href="https://twitter.com" className="text-2xl text-gray-400 hover:text-blue-400 transition">
          <i className="fab fa-twitter"></i>
        </a>
        <a href="https://instagram.com" className="text-2xl text-gray-400 hover:text-pink-500 transition">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://linkedin.com" className="text-2xl text-gray-400 hover:text-blue-700 transition">
          <i className="fab fa-linkedin"></i>
        </a>
      </div>
      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text text-gray-400">Subscribe to our newsletter</span>
        </label>
        <div className="relative">
          <input type="text" placeholder="Your email" className="input input-bordered w-full pr-16" />
          <button className="btn btn-primary absolute top-0 right-0 rounded-l-none">Subscribe</button>
        </div>
      </div>
    </div>
  </div>

  {/* Copyright */}
  <div className="mt-8 text-center text-sm text-gray-500 border-t border-gray-700 pt-4">
    © {new Date().getFullYear()} ArtVista Market. All rights reserved.
  </div>
</footer>

        </div>
    );
};

export default Overview;
