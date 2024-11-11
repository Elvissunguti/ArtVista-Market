import react from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-gray-300 py-10 sm:md-2 md:mt-2 mt-auto">
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
        <Link to="/" className="block hover:text-primary transition">Shop</Link>
        <Link to="/" className="block hover:text-primary transition">About Us</Link>
        <Link to="/" className="block hover:text-primary transition">Contact</Link>
        <Link to="/" className="block hover:text-primary transition">Terms of Service</Link>
        <Link to="/" className="block hover:text-primary transition">Privacy Policy</Link>
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

    )
}

export default Footer;