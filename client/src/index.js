import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Navbar from './Navbar';
import About from './About';
import Service from './Service';
import Footer from './Footer';
import 'font-awesome/css/font-awesome.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App/> */}
    {/* <StreamJoin/> */}
    {/* <Stream/> */}
    <Navbar/>
    <About/>
    <Service/>
    <Footer/>

  </React.StrictMode>
);
