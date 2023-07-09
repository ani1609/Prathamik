import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import './index.css';

function Navbar()
{
  const [navbarShadow, setNavbarShadow] = useState(false);
  const [navTabscolor, setNavTabsColor]= useState(false);
  const [loginSignupColor, setLoginSignupColor]= useState(false);
  const showShadow = () => {
    if (window.scrollY > 50)
    {
      setNavTabsColor(true);
      setLoginSignupColor(true);
      setNavbarShadow(true);
    }
    else {
      setNavTabsColor(false);
      setLoginSignupColor(false);
      setNavbarShadow(false);
    }
  }
  window.addEventListener('scroll', showShadow);

  return (
    <div>
      <nav className={navbarShadow ? 'transparency' : 'navbar'}>
        <a href='http://localhost:3000/' className='logo-container'>
            <div className='logo'>  </div>
            <h1>Prathamik</h1>
        </a>

        <ul className={navTabscolor?'navigations-tabs nav-tabs-color':'navigations-tabs nav-tabs-white'}>
          <li><a href="/">HOME</a></li>
          <Link className='li' to="/platform">Platform</Link>
          <Link className='li' to="/stream">Stream</Link>
          <Link className='li' to="/streamjoin">StreamJoin</Link>
          <li>
            <div className='login-signup-container'>
              <Link to="/login" className={loginSignupColor?'login login-color' : 'login login-white'}>LOG IN</Link>
              <Link to="/signup" className={loginSignupColor?'signup signup-color' : 'signup signup-white'}>SIGN UP</Link>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;