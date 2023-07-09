import React from 'react';
import './index.css';
import './Stream.css'
import './App.css';
import Navbar from './Navbar';
import ChatBox from './ChatBox';
import IDE from './IDE';
import { useState } from 'react';
import Board from './Board';
import { useRef } from 'react';

function Stream()
{
    const [code, setCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState('editor');
  const canvasRef = useRef(null);
  const inputRef = useRef(null);

  const handleInput = async (e) => {
    e.preventDefault();
    inputRef.current.value = '';
    const input = `${code}\n${userInput}`;

    try {
      const response = await fetch('http://localhost:3000/input', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input })
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      setMessage(data.output);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleImageInput = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL();

    fetch('http://localhost:3000/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image , userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Image sent successfully!', data);
      })
      .catch((error) => {
        console.error('Error sending image:', error);
      });
  };

  return (
    <div>
      <Navbar/>

      <div className='stream_parent'>
        <div className='participants'>
            <div className='participants_heading'>
                <h3>Participants</h3>
                <h3 className='participants_count'>3</h3>
            </div>
        </div>
        <div className='video'>
            <div className='content'>

            </div>

            <form className='buttons'>
                <button><i class="fa-solid fa-camera"></i></button>
                <button><i class="fa-solid fa-microphone"></i></button>
                <button><i class="fa-solid fa-arrow-up-from-bracket"></i></button>
                <button><i class="fa-solid fa-code"></i></button>
                <button><i class="fa-solid fa-chalkboard"></i></button>
            </form>
        </div>
        <ChatBox
          message={message}
          setCode={setMessage}
          handleInput={handleInput}
          setUserInput={setUserInput}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}

export default Stream;