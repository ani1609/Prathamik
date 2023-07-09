import './Platform.css';
import './index.css';
import React from 'react';
import ChatBox from './ChatBox';
import IDE from './IDE';
import { useState } from 'react';
import Board from './Board';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

function Platform(props) {
  const [profileDetailsShow, setProfiledetailsShow] = useState(false);
  const [code, setCode] = useState('');
  const [userInput, setUserInput] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState('editor');
  const canvasRef = useRef(null);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);
  const [chats, setChats] = useState([]);
  const [output, setOutput] = useState('');
  const [inputX, setInputX] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState('cpp');

  useEffect(() => {
    props.socket.on("new_message", (data) => {
      const incommingMessage = {
        ...data,
        ownedByCurrentUser: data.user === JSON.parse(localStorage.getItem('user')).data._id,
        profilePic: data.profile.profilePic
      }
      setChats((chats) => [...chats, incommingMessage]);
    });

    return () => {
      props.socket.off("new_message");
    }
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("output", (data) => {
      setOutput(data);
    });

    return () => {
      props.socket.off("output");
    }
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("input", (data) => {
      setInputX(data);
    });

    return () => {
      props.socket.off("input");
    }
  }, [props.socket]);

  useEffect(() => {
    props.socket.on("bot_message", (data) => {
      setChats((chats) => [...chats, data]);
    });

    return () => {
      props.socket.off("bot_message");
    }
  }, [props.socket]);

  // DO NOT DELETE THIS CODE
  // setTimeout(async () => {
  //   const userInput = 'tell me a mcq question on the above code';
  //   console.log('code' + code);
  //   const input = `${code}\n${userInput}`;
  //   console.log('input' + input);
  //   try {
  //     const response = await fetch('http://localhost:3000/input', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ input })
  //     });

  //     if (!response.ok) {
  //       throw new Error('Request failed');
  //     }

  //     const data = await response.json();
  //     setMessage(data.output);
  //     setChats((chats) => [
  //       ...chats,
  //       { input: data.output, ownedByCurrentUser: false, profilePic: 'x.png' }
  //     ]);
  //     props.socket.emit('bot_message', {
  //       input: data.output,
  //       ownedByCurrentUser: false,
  //       profilePic: 'x.png'
  //     });
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // }, 30000);

  const handleInput = async (e) => {
    e.preventDefault();
    setInput(userInput);
    sendInput(userInput);
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
      setChats((chats) => [...chats, { input: data.output, ownedByCurrentUser: false, profilePic: 'x.png' }]);
      props.socket.emit("bot_message", { input: data.output, ownedByCurrentUser: false, profilePic: 'x.png' });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  function sendInput(input) {
    const user = JSON.parse(localStorage.getItem('user')).data._id;
    props.socket.emit("chat_message", { input, user });
  }

  function voice() {
    let recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-GB";

    recognition.onstart = function () {
      console.log('Speech recognition started');
    };

    recognition.onresult = function (event) {
      console.log('Speech recognition result');
      let result = event.results[0][0].transcript;
      inputRef.current.value = result;
      setUserInput(result);
    };

    recognition.onerror = function (event) {
      console.log('Speech recognition error:', event.error);
    };

    recognition.start();
  }

  const handleImageInput = (e) => {
    e.preventDefault();
    const formData = new FormData();
    const fileInput = e.target.elements.image.files[0];
    formData.append('image', fileInput);
    fetch('http://localhost:5000/ocr', {
      method: 'POST',
      body: formData
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Image sent successfully!', data);
      })
      .catch((error) => {
        console.error('Error sending image:', error);
      });
  };

  function handleProfileClick() {
    if (profileDetailsShow) {
      setProfiledetailsShow(false);
    }
    else {
      setProfiledetailsShow(true);
    }
  }

  const handleRun = async (e) => {
    try {
      const response = await axios.request({
        method: 'POST',
        url: 'https://online-code-compiler.p.rapidapi.com/v1/',
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': '743ef54f88mshced8245741bbd13p19bbaejsne9c59b00aae5',
          'X-RapidAPI-Host': 'online-code-compiler.p.rapidapi.com'
        },
        data: {
          language: currentLanguage,
          version: 'latest',
          code: code,
          input: inputX
        }
      });
      setOutput(response.data.output);
      props.socket.emit("output", response.data.output);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='platform_parent'>
      {/* <form onSubmit={handleImageInput}>
          <input type="file" name='image' />
          <button type="submit">Submit</button>
        </form> */}

      <div className='platform_navbar'>
        <div className='navbar_1'>

          <div className='platform_logo'>
            {/* <img src={Logo}/> */}
            <h1>Prathamik</h1>
            <p>Online IDE</p>
          </div>

          <form>
            <button type='button' onClick={handleRun}>Run <i class="fa-solid fa-play"></i></button>
          </form>
        </div>

        <div className='navbar_2'>
          <div className='profile' onClick={handleProfileClick}>
            {/* <img src={User}/> */}
            <div className='profile-pic'></div>
            <span><i class="fa-solid fa-angle-down"></i></span>
            {profileDetailsShow && <ul>
              <li>Profile</li>
              <li>Log out</li>
            </ul>}
          </div>
        </div>

      </div>

      <div className='platform_components'>
        {show === 'editor' && (
          <div className="ide_in_platform_container">
            <IDE socket={props.socket} setCurrentLanguage={setCurrentLanguage} input={inputX} setInput={setInputX} output={output} code={code} isAdmin={props.isAdmin} setCode={setCode} setShow={setShow} />
          </div>
        )}

        {show === 'board' && (
          <div className="board_in_platform_container">
            <Board handleImageInput={handleImageInput} canvasRef={canvasRef} />
          </div>
        )}

        <div className='chat_in_platform_container'>
          <ChatBox
            message={message}
            handleInput={handleInput}
            setUserInput={setUserInput}
            userInput={userInput}
            inputRef={inputRef}
            input={input}
            sendInput={sendInput}
            chats={chats}
            voice={voice}
          />
        </div>
      </div>
    </div>
  );
}

export default Platform;