import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Landing from './Landing';
import About from './About';
import Service from './Service';
import Footer from './Footer';
import Platform from './Platform';
import Stream from './Stream';
import Signup from './Signup';
import Login from './Login';
import 'font-awesome/css/font-awesome.min.css';
import { useState } from 'react';
import Container from './Container';
import io from "socket.io-client";

const socket = io.connect("http://localhost:3000");

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home setIsAdmin={setIsAdmin} />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/:id" element={<Platform isAdmin={isAdmin} socket={socket} />} />
          <Route exact path="/stream" element={<Stream />} />
          <Route exact path='/whiteboard' element={<Container socket={socket} />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home(props) {
  return (
    <div>
      <Navbar />
      <Landing setIsAdmin={props.setIsAdmin}  />
      <About />
      <Service />
      <Footer />
    </div>
  );
}

export default App;
