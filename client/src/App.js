import './App.css';
import React from 'react';
import Navbar from './Navbar';
import ChatBox from './ChatBox';
import IDE from './IDE';
import { useState } from 'react';
import { useRef } from 'react';

function App() {
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
    <div className="App">
      <Navbar />
      <div className='body'>
        {show === 'editor' && <IDE setCode={setCode} setShow={setShow} />}
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

export default App;