import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone } from '@fortawesome/free-solid-svg-icons';

function ChatBox(props) {
  const chatboxRef = React.createRef();

  useEffect(() => {
    scrollToBottom();
  }, [props.chats]);

  const scrollToBottom = () => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  };

  const handleColorChange = (option) => {
    if (option === 'A') {
      if (props.correctAnswer === 'A')
        props.setColor({
          A: '#3caf59',
          B: 'lightgrey'
        });
      else
        props.setColor({
          A: '#cb3a3a',
          B: 'lightgrey'
        });
    } else {
      if (props.correctAnswer === 'B')
        props.setColor({
          B: '#3caf59',
          A: 'lightgrey'
        });
      else
        props.setColor({
          B: '#cb3a3a',
          A: 'lightgrey'
        });
    }
  }

  return (
    <div className='chatbox_parent'>
      <div className='chatbox_header'>
        <img src='/x.png' alt='bot'></img>
        <div className='bot_details'>
          <h3>Penguin</h3>
          <p>AI bot</p>
        </div>
      </div>

      <div className='chat_container' ref={chatboxRef}>

        {props.chats.map((chat) => (
          chat.type === 'mcq' ?
            (<div className={`${chat.ownedByCurrentUser ? "user_chat" : "bot_chat"}`}>
              {!chat.ownedByCurrentUser && <img src={`${process.env.REACT_APP_SERVER_URL}/uploads/${chat.profilePic}`} />}
              <div className='col'>
                <p>{chat.question}</p>
                <div className='mcq_options'>
                  <p className='mcq_option' style={{ backgroundColor: props.color.A }} onClick={() => handleColorChange('A')}>{chat.options[0]}</p>
                  <p className='mcq_option' style={{ backgroundColor: props.color.B }} onClick={() => handleColorChange('B')}>{chat.options[1]}</p>
                </div>
              </div>
            </div>) :
            (<div className={`${chat.ownedByCurrentUser ? "user_chat" : "bot_chat"}`}>
              {!chat.ownedByCurrentUser && <img src={`${process.env.REACT_APP_SERVER_URL}/uploads/${chat.profilePic}`} />}
              <p>{chat.input}</p>
            </div>)
        ))}

      </div>

      <form autoComplete="off">
        <input type='text' name='chat' placeholder='Ask something...'
          onChange={(event) => {
            props.setUserInput(event.target.value);
          }}
          ref={props.inputRef}
        />
        <button type='button' onClick={props.voice}>
          <FontAwesomeIcon icon={faMicrophone} fontSize={20} style={{ color: "#4b4f5d" }} />
        </button>
        {props.show === 'editor' && <button onClick={props.handleInput}>
          <i class="fa-solid fa-paper-plane"></i>
        </button>}
        {props.show === 'board' && <button onClick={props.handleInputBoard}>
          <i class="fa-solid fa-paper-plane"></i>
        </button>}
        {props.show === 'stream' && <button onClick={props.handleInput}>
          <i class="fa-solid fa-paper-plane"></i>
        </button>}
      </form>
    </div>
  );
}
export default ChatBox;