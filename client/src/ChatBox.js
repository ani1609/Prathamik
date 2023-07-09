import './ChatBox.css';
import { useState } from 'react';
function ChatBox() {
  const [message, setMessage] = useState('');

  const handleInput = async (e) => {
    e.preventDefault();
    const input = e.target.form[0].value;
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

  return (
    <div className='header_parent'>
      <div className='chat_container'>
        <div className='chatbox'>
          {message && <div className='chat'>
            <p>{message}</p>
          </div>}
        </div>
        <form autocomplete="off">
          <input type='text' name='chat' placeholder='Type a message...' />
          <button onClick={handleInput}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;