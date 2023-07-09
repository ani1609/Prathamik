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
import StreamJoin from './StreamJoin';
import Signup from './Signup';
import Login from './Login';
import 'font-awesome/css/font-awesome.min.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/platform" element={<Platform />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/streamjoin" element={<StreamJoin />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <Navbar />
      <Landing />
      <About />
      <Service />
      <Footer />
    </div>
  );
}

export default App;
