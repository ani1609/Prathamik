import './ChatBox.css';
import { useState } from 'react';
function ChatBox(props) {

  return (
    <div className='header_parent'>
      <div className='chat_container'>
        <div className='chatbox'>
          {props.message && <div className='chat'>
            <p>{props.message}</p>
          </div>}
        </div>
        <form autocomplete="off">
          <input type='text' name='chat' placeholder='Type a message...'
            onChange={(event) => props.setUserInput(event.target.value)}
          />
          <button onClick={props.handleInput}>Send</button>

        </form>
      </div>
    </div>
  );
}

export default ChatBox;