import './App.css';
import React from 'react';
import Navbar from './Navbar';
import ChatBox from './ChatBox';
import IDE from './IDE';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className='body'>
        <IDE />
        <ChatBox />
      </div>
    </div>
  );
}

export default App;