import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Landing from './Landing';
import About from './About';
import Service from './Service';
import Footer from './Footer';
import Platform from './Platform';
import Container from './Container';
import Signup from './Signup';
import Login from './Login';
import 'font-awesome/css/font-awesome.min.css';
import { useState } from 'react';
import { authToken, createMeeting } from "./API";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [meetingId, setMeetingId] = useState(null);

  const getMeetingAndToken = async (id) => {
    const meetingId =
      id == null ? await createMeeting({ token: authToken }) : id;
    setMeetingId(meetingId);
    return meetingId;
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home setIsAdmin={setIsAdmin} meetingId={meetingId} setMeetingId={setMeetingId} getMeetingAndToken={getMeetingAndToken} />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/:roomid" element={<Platform isAdmin={isAdmin} meetingId={meetingId} setMeetingId={setMeetingId} getMeetingAndToken={getMeetingAndToken} />} />
          <Route exact path='/whiteboard' element={<Container />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home(props) {
  return (
    <div>
      <Navbar />
      <Landing setIsAdmin={props.setIsAdmin} meetingId={props.meetingId} setMeetingId={props.setMeetingId} getMeetingAndToken={props.getMeetingAndToken} />
      <About />
      <Service />
      <Footer />
    </div>
  );
}

export default App;
