import React, { useState, useEffect } from 'react';
import './Landing.css';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';

function Landing() {
  const [shouldRender, setShouldRender] = useState(false);
  const [img, setImg] = useState(true);
  const [room, setRoom] = React.useState('')
  const router = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setImg(!img);
    }, 2000);

    return () => clearInterval(interval);
  }, [img]);

  const handleNewMeeting = () => {
    const id = Math.random().toString(36).substring(2, 5) + '-' +Math.random().toString(36).substring(2, 5);
    router(`${id}`);
    setRoom(id);
  }

  return (
    <div className='body'>
      {shouldRender && (
        <div className='landing_parent'>
          <div className='details'>
            <h1>Learn At Ease.
              <p id='middleText'>
                With Ai Assistance.
              </p>
            </h1>
            <p>
              Prathamik is an online learning platform designed to empower teachers and provide a seamless experience for students. With the assistance of an AI bot, teachers can efficiently solve students' doubts and enhance the learning process.
            </p>
            <div className='buttons'>
              <button onClick={handleNewMeeting}><FontAwesomeIcon icon={faVideo} style={{ color: "#ffffff", }} />New Meeting</button>
              <div className='inputBox'>
                <FontAwesomeIcon icon={faKeyboard} style={{ color: "grey", }} />
                <input className='input' type='text' placeholder='Enter a Code' value={room}
                  onChange={(e) => setRoom(e.target.value)}
                />
              </div>
              {!room && <span className='joinBtn'> Join </span>}
              {room && <Link to={`${room}`} className='joinBtn' style={{ color: '#3086e3' }}> Join </Link>}
            </div>
            <div className='circles'>
              <span style={{ backgroundColor: '#18405A' }}></span>
              <span style={{ backgroundColor: '#355F75' }}></span>
              <span style={{ backgroundColor: '#B6C5CE' }}></span>
            </div>
            <div className='end'>
              <div className='line'></div>
              <div className='learnMore'>
                <span>Learn More</span> &nbsp;about Prathamik
              </div>
            </div>
          </div>
          <div className='right'>
            <img
              src='ide2.png'
              alt='ide'
              className={`ide_img ${img ? 'invisible' : 'visible'}`}
            />
            <img
              src='wh1.png'
              alt='ide'
              className={`ide_img sm ${img ? 'visible' : 'invisible'}`}
            />
          </div>
          <div className='bot'>
            <img src='/x.png' alt='bot' className='bot_img' />
          </div>
        </div>
      )}
    </div>
  );
}

export default Landing;