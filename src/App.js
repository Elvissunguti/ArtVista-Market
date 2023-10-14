import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Component/Login/Login';
import SignUp from './Component/SignUp/SignUp';

function App() {
  return (
    <div className="App">
      <>
      <Router>
        <Routes>
          <>
          <Route path="/login" element={<Login />} />
          <Route path="/sign up" element={<SignUp />} />
          </>

        </Routes>
      </Router>
      </>
      
    </div>
  );
}

export default App;
