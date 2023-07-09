import './ChatBox.css';
function ChatBox(props) {

  return (
    <div className='header_parent'>
      <div className='chat_container'>
        <div className='chatbox'>
          {props.message && <div className='chat'>
            <p>{props.message}</p>
          </div>}
        </div>
        <form autoComplete="off">
          <input type='text' name='chat' placeholder='Type a message...'
            onChange={(event) => props.setUserInput(event.target.value)}
            ref={props.inputRef}
          />
          <button onClick={props.handleInput}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatBox;