import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import './index.css';
import axios from 'axios';

function Navbar() {
  const [navbarShadow, setNavbarShadow] = useState(false);
  const showShadow = () => {
    if (window.scrollY > 50) {
      setNavbarShadow(true);
    } else {
      setNavbarShadow(false);
    }
  };
  window.addEventListener('scroll', showShadow);

  const scrollToHome = () => 
    {
      const aboutSection = document.querySelector('.landing_body');
      const offsetTop = aboutSection.offsetTop;
      const offsetHeight = aboutSection.offsetHeight;
      const scrollToPosition = offsetTop - 0;
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
    }

    const scrollToAbout = () => 
    {
      const aboutSection = document.querySelector('.about_container');
      const offsetTop = aboutSection.offsetTop;
      const offsetHeight = aboutSection.offsetHeight;
      const scrollToPosition = offsetTop - 40;
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
    }

    const scrollToServices = () => 
    {
      const aboutSection = document.querySelector('.service_parent');
      const offsetTop = aboutSection.offsetTop;
      const offsetHeight = aboutSection.offsetHeight;
      const scrollToPosition = offsetTop - 40;
      window.scrollTo({
        top: scrollToPosition,
        behavior: 'smooth'
      });
    }
    

  const [profileDetailsShow, setProfileDetailsShow] = useState(false);

  function handleProfileClick() {
    setProfileDetailsShow(!profileDetailsShow);
  }

  const user = JSON.parse(localStorage.getItem('user'));
  const [dp, setDp] = useState('');
  const [initial, setInitial] = useState('');
  useEffect(() => {
    if (user && user.data.profilePic !== null) {
      setDp(user.data.profilePic);
    }
    setInitial(user ? user.data.name.charAt(0) : '');
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setProfileDetailsShow(false);
  };

  const [image, setImage] = useState('');

  const handleImageSubmit = () => {
    const url = 'http://localhost:3000/';

    const formData = new FormData();
    formData.append('image', image);
    formData.append('userId', user.data._id);
    axios
      .post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((res) => {
        setDp(res.data);
        localStorage.setItem( 'user', JSON.stringify({data: {...user.data, profilePic: res.data}}));
      })
      .catch((err) => {
        console.error(err);
      });
    setProfileDetailsShow(false);
  };

  if (user) {
    return (
      <div>
        <nav className={navbarShadow ? 'transparency' : 'navbar'}>
          <a href='http://localhost:3000/' className='logo-container'>
            <div className='logo'></div>
            <h1>Prathamik</h1>
          </a>

          <ul className='navigations-tabs'>
            <li onClick={scrollToHome}><button>HOME</button></li>
            <li onClick={scrollToAbout}><button>ABOUT US</button></li>
            <li onClick={scrollToServices}><button>SERVICES</button></li>

            <li className='navbar_profile'>
              <div className='user' onClick={handleProfileClick}>
                {dp ? (
                  <img
                    src={`http://localhost:3000/uploads/${dp}`}
                    alt=''
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
              <span onClick={handleProfileClick}>
                <i className='fa-solid fa-angle-down'></i>
              </span>
              {profileDetailsShow && (
                <ul>
                  <li>
                    <input
                      id='imageInput'
                      type='file'
                      onChange={(e) => setImage(e.target.files[0])}
                      required
                    />
                    <button onClick={handleImageSubmit}>Upload Image</button>
                  </li>
                  <li onClick={handleLogout}>Log out</li>
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    );
  } else {
    return (
      <div>
        <nav className={navbarShadow ? 'transparency' : 'navbar'}>
          <a href='http://localhost:3000/' className='logo-container'>
            <div className='logo'></div>
            <h1>Prathamik</h1>
          </a>

          <ul className='navigations-tabs'>
            <li onClick={scrollToHome}><button>HOME</button></li>
            <li onClick={scrollToAbout}><button>ABOUT US</button></li>
            <li onClick={scrollToServices}><button>SERVICES</button></li>
            <li className='login-signup-container'>
              <Link to='/login' className='login'>
                LOG IN
              </Link>
              <Link to='/signup' className='signup'>
                SIGN UP
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default Navbar;