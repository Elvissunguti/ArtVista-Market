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
import MyArtWork from './Component/MyArtWork/MyArtWork';
import Messages from './Component/Messages/Messages';
import Product from './Component/Product/Product';
import DashBoard from './Component/DashBoard/DashBoard';
import AddressEdit from './Component/Address/AddressEdit';
import AddressInfo from './Component/Address/AddressInfo';
import CheckOut from './Component/CheckOut/CheckOut';
import SentOrders from './Component/Order/SentOrders';
import ReceivedOrders from './Component/Order/ReceivedOrders';
import Order from './Component/Order/Order';

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
            <Route path="/all_artwork" element={<AllArtWork />} />
            <Route path="/drawings" element={<Drawings />} />
            <Route path="/paintings" element={<Paintings />} />
            <Route path="/my_artworks" element={<MyArtWork /> } />
            <Route path="/artpage/:title" element={<ArtPage />} />
            <Route path="/wishlist" element={<WishList />} />
            <Route path="/cartlist" element={<CartList />} />
            <Route path="/profileUpload" element={<ProfileUpload />} />
            <Route path="/sell_artwork" element={<Product />} />
            <Route path="/seller_profile" element={<Artist />} />
            <Route path="/seller-profile/:userName" element={<ArtistPage />} />
            <Route path='/chats' element={<Messages />} />
            <Route path="/chatpage/:artistId" element={<ChatPage />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/address/edit" element={<AddressEdit />} />
            <Route path="/address" element={<AddressInfo />} />
            <Route path="orders" element={<Order />} />
            <Route path="/sent_orders" element={<SentOrders />} />
            <Route path="/received_order" element={<ReceivedOrders />} />
            <Route path="/checkout" element={<CheckOut />} />
            
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
  return <h1>Page not found. <Link to="/all_artwork" className="text-red-600">Go to Homepage</Link></h1>;
}

export default App;
