import React, {useState, useEffect} from 'react';
import './Navbar.css';


function Navbar()
{
    const [navbar, setNavbar]=useState(false);
    const showShadow =() => {
        if (window.scrollY>10)
        {
            setNavbar(true);
        }
        else
        {
            setNavbar(false);
        }

    }
    window.addEventListener('scroll',showShadow);

    const handleMouseEnter= () =>
    {
        document.querySelector('.login').style.backgroundColor='#404575';
        document.querySelector('.login').style.color='white';
        document.querySelector('.signup').style.backgroundColor='white';
        document.querySelector('.signup').style.color='#404575';
    }

    const handleMouseLeave= () =>
    {
        document.querySelector('.login').style.backgroundColor='white';
        document.querySelector('.login').style.color='#404575';
        document.querySelector('.signup').style.backgroundColor='#404575';
        document.querySelector('.signup').style.color='white';
    }

    return (
        <nav className={navbar ? 'navbar nav-shadow':'navbar'}>
                <div className='logo-container'>
                    <h3><a href=""><span className='logo-left'>Prathamik</span><span className='logo-right'>.edu</span></a></h3>
                </div>

                <ul className='navigations-tabs'>
                    <li><a href="">Home</a></li>
                    <li><a href="">Booking Form</a></li>
                    <li><a href="">Category</a></li>
                    <li><a href="">About Us</a></li>
                </ul>

                <div className='login-signup-container'>
                    <button type="button" className='login' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>Log in</button>
                    <button type="button" className='signup'>Sign up</button>
                </div>
        </nav>
    );
}


export default Navbar;