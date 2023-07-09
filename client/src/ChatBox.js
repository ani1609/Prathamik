import './ChatBox.css';
import './index.css';
import Send from './images/send.png';
import Bot from './images/bot.jpeg';

function ChatBox(props) {
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
        
        <div className='chatbox'>
          {props.message && <div className='chat'>
            <p>{props.message}</p>
          </div>}
        </div>
        <form autoComplete="off">
          <input type='text' name='chat' placeholder='Ask something...'
            onChange={(event) => props.setUserInput(event.target.value)}
            ref={props.inputRef}
          />
          <button onClick={props.handleInput}> 
            <img src={Send} alt="send"/>
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;