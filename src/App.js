import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './Component/Login/Login';
import SignUp from './Component/SignUp/SignUp';
import Home from './Component/Home/Home';
import AllArtWork from './Component/AllArtWork/AllArtWork';
import ArtPage from './Component/Shared/ArtPage';
import WishList from './Component/WishList/WishList';
import CartList from './Component/CartList/CartList';
import ProfileUpload from './Component/Profile/ProfileUpload';
import Artist from './Component/Artist/Artist';
import ArtistPage from './Component/Artist/ArtistPage';
import Drawings from './Component/Drawings/Drawings';
import Paintings from './Component/Paintings/Paintings';
import ChatPage from './Component/Shared/ChatPage';

function App() {

  const [loggedIn, setLoggedIn] = useState(false); 

  useEffect(() => {
    // Check if the token exists in cookies to determine if the user is logged in
    const token = localStorage.getItem('token'); 
    setLoggedIn(!!token);
  }, []);


  return (
    <div className="App">
      <Router>
        <Routes>
          {/* logged in routes */}
          {loggedIn ? (
            <>
            <Route path="/" element={<Home />} />
            <Route path="/all artwork" element={<AllArtWork />} />
            <Route path="/all artwork/drawings" element={<Drawings />} />
            <Route path="/all artwork/paintings" element={<Paintings />} />
            <Route path="/artpage/:title" element={<ArtPage />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/cartlist" element={<CartList />} />
            <Route path="/profileUpload" element={<ProfileUpload />} />
            <Route path="/seller profile" element={<Artist />} />
            <Route path="/seller-profile/:userName" element={<ArtistPage />} />
            <Route path="/chatpage/:artistId" element={<ChatPage />} />
            
            </>
          ) : (
            <>
            <Route exact path="/login" element={<Login />} />
            <Route path="/sign up" element={<SignUp />} />
            <Route path="/*" element={<NotFound />} />
            </>
          )}
        </Routes>
      </Router>
      
    </div>
  );
};

function NotFound() {
  return <h1>Page not found. <Link to="/all artwork">Go to Homepage</Link></h1>;
}

export default App;
