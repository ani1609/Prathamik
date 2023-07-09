import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Landing from './Landing';
import About from './About';
import Service from './Service';
import Footer from './Footer';
import Platform from './Platform';
import Whiteboard from './whiteboard'
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
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/:id" element={<Platform />} />
          <Route exact path="/stream" element={<Stream />} />
          <Route exact path="/streamjoin" element={<StreamJoin />} />
          <Route exact path="/board" element={<Whiteboard/>}/>

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
