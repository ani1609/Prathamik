import React, { useState , useEffect } from 'react';
import './ChatBox.css';
import './index.css';

function ChatBox(props) {

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

        {/* {props.input && <div className='user_chat'>
          <p>{props.input}</p>
        </div>}

        {props.message && <div className='bot_chat'>
            <img src='/x.png'/>
            <p>{props.message}</p>
          </div>} */}

        {props.chats.map((chat) => (
          <div className='bot_chat'>
            <p>{chat}</p>
          </div>
        ))}

      </div>

      <form autoComplete="off">
        <input type='text' name='chat' placeholder='Ask something...'
          onChange={(event) => {
            props.setUserInput(event.target.value);
          }}
          ref={props.inputRef}
        />
        <button onClick={props.handleInput}>
          {/* <img src={Send} alt="send"/> */}
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
}

export default ChatBox;