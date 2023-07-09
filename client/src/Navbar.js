import React, { useState } from 'react';
import './Navbar.css';

function Navbar() {
  const [navbar, setNavbar] = useState(false);
  const [loginBackgroundColor, setLoginBackgroundColor] = useState('white');
  const [loginColor, setLoginColor] = useState('#404575');
  const [signupBackgroundColor, setSignupBackgroundColor] = useState('#404575');
  const [signupColor, setSignupColor] = useState('white');
  const showShadow = () => {
    if (window.scrollY > 10) {
      setNavbar(true);
    }
    else {
      setNavbar(false);
    }

  }
  window.addEventListener('scroll', showShadow);

  const handleMouseEnter = () => {
    setLoginBackgroundColor('#404575');
    setLoginColor('white');
    setSignupBackgroundColor('white');
    setSignupColor('#404575');
  }

  const handleMouseLeave = () => {
    setLoginBackgroundColor('white');
    setLoginColor('#404575');
    setSignupBackgroundColor('#404575');
    setSignupColor('white');
  }

  return (
    <nav className={navbar ? 'navbar nav-shadow' : 'navbar'}>
      <div className='logo-container'>
        <h3><a href="/"><span className='logo-left'>Prathamik</span>
          <span className='logo-right'>.edu</span>
        </a></h3>
      </div>

      <ul className='navigations-tabs'>
        <li><a href="/">Home</a></li>
        <li><a href="/">Booking Form</a></li>
        <li><a href="/">Category</a></li>
        <li><a href="/">About Us</a></li>
      </ul>

      <div className='login-signup-container'>
        <button type="button" className='login'
          style={{ backgroundColor: loginBackgroundColor, color: loginColor }}
          onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}
        >
          Log in
        </button>
        <button type="button" className='signup'
          style={{ backgroundColor: signupBackgroundColor, color: signupColor }}
        >
          Sign up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;