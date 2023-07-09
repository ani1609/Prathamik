import './Platform.css';
import './index.css';
import React from 'react';
import ChatBox from './ChatBox';
import IDE from './IDE';
import { useState } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Container from './Container';

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
  const [change, setChange] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [color, setColor] = useState({
    A: 'lightgrey',
    B: 'lightgrey'
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChange(prevChange => !prevChange);
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const input = `You are a teacher preparing a quiz for your students. Please help me create a multiple-choice question with two options (A and B) based on the given context.

      Context: will be given by the user

      Question: [Insert your question related to the context]

      A) [Option A]

      B) [Option B]

      Please specify the correct answer by choosing one of the following:
      1) A
      2) B

      Example 1:
      Context: The following question is about the solar system.
      Question: Which planet is closest to the Sun?
      A) Venus
      B) Mercury
      Correct Answer: B

      Example 2:
      Context: The following question is about European geography.
      Question: What is the capital of France?
      A) Paris
      B) Berlin
      Correct Answer: A

      Actual Question:
      Context: ${code}
      Question: [Your generated question goes here]
      A) [Option A]
      B) [Option B]
      Correct Answer: [Specify the correct answer by choosing A or B]
      `;
      console.log(input);
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
        const questionRegex = /Question: (.+)/;
        const questionMatch = data.output.match(questionRegex);
        const question = questionMatch ? questionMatch[1].trim() : "";

        const optionsRegex = /[A-Z]\) (.+)/g;
        const optionsMatches = data.output.matchAll(optionsRegex);
        const options = Array.from(optionsMatches, match => match[1].trim());

        const correctAnswerRegex = /Correct Answer: ([A-Z])/;
        const correctAnswerMatch = data.output.match(correctAnswerRegex);
        const correctAnswer = correctAnswerMatch ? correctAnswerMatch[1] : "";
        setCorrectAnswer(correctAnswer);
        setChats((chats) => chats.filter((chat) => chat.type !== 'mcq'));
        setColor({
          A: 'lightgrey',
          B: 'lightgrey'
        });
        setChats((chats) => [
          ...chats,
          { input: data.output, ownedByCurrentUser: false, profilePic: 'x.png', type: 'mcq' , question, options, correctAnswer }
        ]);
        props.socket.emit('bot_message', {
          input: data.output,
          ownedByCurrentUser: false,
          profilePic: 'x.png'
        });
      } catch (error) {
        console.error('Error:', error);
      }
    };

    if (code !== '')
      fetchData();
  }, [change]);


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

  const handleInputBoard = async (e) => {
    e.preventDefault();
    try {
      await captureScreenshot();
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

  const captureScreenshot = async () => {
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('image', blob, 'screenshot.png');

      fetch('http://localhost:5000/ocr', {
        method: 'POST',
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            response.json().then(async (value) => {
              console.log('Screenshot sent successfully');
              console.log('Server output:', value);
              setInput(userInput);
              sendInput(userInput);
              inputRef.current.value = '';
              const input = `You are tasked with creating an AI model that acts as an assistant to students in a classroom. The AI model should help students understand the context of the information written on the board by the teacher.

              Example 1 :
              Board: x + y = 6
              Question by student: What is the subject we are learning today
              AI Assistant: We are learning Maths equations.

              Example 2:
              Board: Life is hard but we should not give up
              Question by student: What is written on the board
              AI Assistant: It states, "Life is hard but we should not give up."

              Actual :
              Board: ${value.text}
              Question by student: \n${userInput}
              AI Assistant: (Your generated response goes here);`;

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
              props.socket.emit("bot_message", { input: data.output, ownedByCurrentUser: false, profilePic: 'x.png' });// <-- This should reflect the updated state
            });
          } else {
            console.error('Error sending screenshot:', response.statusText);
          }
        })
        .catch((error) => {
          console.error('Error sending screenshot:', error);
        });
    });
  };

  return (
    <div className='platform_parent'>

      <div className='platform_navbar'>
        <div className='navbar_1'>

          <div className='platform_logo'>
            <h1>Prathamik</h1>
            <p>Online IDE</p>
          </div>
          <div>
            <select onChange={(e) => setShow(e.target.value)}>
              <option value="editor">IDE</option>
              <option value="board">Board</option>
            </select>
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
            <Container socket={props.socket} canvasRef={canvasRef} />
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
            show={show}
            handleInputBoard={handleInputBoard}
            captureScreenshot={captureScreenshot}
            correctAnswer={correctAnswer}
            color={color}
            setColor={setColor}
          />
        </div>
      </div>
    </div>
  );
}

export default Platform;