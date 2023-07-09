import React, { useState } from 'react';
import './ChatBox.css';
import './index.css';

import Bot from './images/bot.jpeg';
import User from './images/user.jpeg'



function ChatBox(props) 
{
  
  return (
    <div className='chatbox_parent'>
      <div className='chatbox_header'>
          <img src={Bot} alt='bot'></img>
          <div className='bot_details'>
            <h3>Cupkaks</h3>
            <p>AI bot</p>
          </div>
      </div>

      <div className='chat_container'>
        
        {/* {props.message && <div className='bot_chat'>
            <p>{props.message}</p>
          </div>} */}

          

          <div className='user_chat'>
            <p>User I apologize, jwehr but as an AI language model.</p>
            <img src={User}/>
          </div>
          <div className='bot_chat'>
            <img src={Bot}/>
            <p> AI I apologize, but as an AI language model, I don't have real-time data or the ability to access current weather information.</p>
          </div>
          
          

        {/* {props.input && <div className='user_chat'>
          <p>{props.input}</p>
        </div>} */}
            
            
        
        
      </div>

      <form autoComplete="off">
          <input type='text' name='chat' placeholder='Ask something...'
            onChange={(event) => props.setUserInput(event.target.value)}
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