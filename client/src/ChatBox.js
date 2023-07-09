import React, { useState, useEffect } from 'react';
import './ChatBox.css';
import './index.css';

function ChatBox(props) {

  const handleColorChange = (option) => {
    if (option === 'A') {
      if(props.correctAnswer === 'A')
      props.setColor({
        A: 'green',
        B: 'lightgrey'
      });
      else
      props.setColor({
        A: 'red',
        B: 'lightgrey'
      });
    } else {
      if(props.correctAnswer === 'B')
      props.setColor({
        B: 'green',
        A: 'lightgrey'
      });
      else
      props.setColor({
        B: 'red',
        A: 'lightgrey'
      });
    }
  }

  return (
    <div className='chatbox_parent'>
      <div className='chatbox_header'>
        <img src='/x.png' alt='bot'></img>
        <div className='bot_details'>
          <h3>Cupkaks</h3>
          <p>AI bot</p>
        </div>
      </div>

      <div className='chat_container'>

        {props.chats.map((chat) => (
          chat.type !== 'mcq' ?
            (<div className={`${chat.ownedByCurrentUser ? "user_chat" : "bot_chat"}`}>
              {!chat.ownedByCurrentUser && <img src={`http://localhost:3000/uploads/${chat.profilePic}`} />}
              <p>{chat.input}</p>
            </div>) :
            (<div className={`${chat.ownedByCurrentUser ? "user_chat" : "bot_chat"}`}>
              {!chat.ownedByCurrentUser && <img src={`http://localhost:3000/uploads/${chat.profilePic}`} />}
              <div className='col'>
                <p>{chat.question}</p>
                <div className='mcq_options'>
                  <p className='mcq_option' style={{backgroundColor : props.color.A}} onClick={() => handleColorChange('A')}>{chat.options[0]}</p>
                  <p className='mcq_option' style={{backgroundColor : props.color.B}} onClick={() => handleColorChange('B')}>{chat.options[1]}</p>
                </div>
              </div>
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
          say!
        </button>
        {props.show === 'editor' && <button onClick={props.handleInput}>
          <i class="fa-solid fa-paper-plane"></i>
        </button>}
        {props.show === 'board' && <button onClick={props.handleInputBoard}>
          <i class="fa-solid fa-paper-plane"></i>
        </button>}
      </form>
    </div>
  );
}

export default ChatBox;