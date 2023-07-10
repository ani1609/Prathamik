import React from 'react';
import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import './index.css';
import Logo from './images/pLogo.png';

function Signup()
{
    const [data,setData]=useState({
        name:'',
        email:'',
        password:'',
        confirm_password:'',
        profilePic: ''
    });

    const [error,setError]=useState('');
    const navigate=useNavigate();

    const handleChange=({currentTarget:input})=>{
        setData({...data,[input.name]:input.value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (data.password!==data.confirm_password)
        {
            setError('Passwords do not match');
            return;
        }
        try {
            const url = 'http://localhost:3000/signup';
            const response = await axios.post(url, data);
            //   const res=response.data;
            navigate('/login');
            console.log(response.data.message);
            setError('');
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                setError(error.response.data.message);
          }
        }
    };

    const [shouldRender,setShouldRender]=useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
          setShouldRender(true);
        }, 100);

        return () => clearTimeout(timeout);
    }, []);

    return(
        <div>
            {shouldRender && <div className='signup-container'>
                <div className='signup_contents'>
                    <div className='signup_left'>

                        <a href='/' className='signup_logo'>
                            <img src={Logo}/>
                            <h1>Prathamik</h1>
                        </a>

                        <form onSubmit={handleSubmit} className='signup_form'>

                            <h1>Join Us</h1>

                            {/* <div className='api_buttons'>
                                <button type='submit'><i class="fa-brands fa-google"></i></button>
                                <button type='submit'><i class="fa-brands fa-facebook-f"></i></button>
                            </div> */}

                            {/* <label htmlFor='name'>Full Name</label> */}
                            <input
                                type="text"
                                placeholder='Name'
                                name="name"
                                id='signup_name'
                                value={data.name}
                                onChange={handleChange}
                                required
                            />


                            {/* <label htmlFor='email'>Email</label> */}
                            <input
                                type="email"
                                placeholder='Email'
                                name="email"
                                id='signup_email'
                                value={data.email}
                                onChange={handleChange}
                                required
                            />


                            {/* <label htmlFor='password'>Password</label> */}
                            <input
                                type="password"
                                placeholder='Password'
                                name="password"
                                id='signup_password'
                                value={data.password}
                                onChange={handleChange}
                                required
                            />


                            {/* <label htmlFor='confirm_password'>Confirm Password</label> */}
                            <input
                                type="password"
                                placeholder='Confirm Password'
                                name="confirm_password"
                                id='signup_confirm_password'
                                value={data.confirm_password}
                                onChange={handleChange}
                                required
                            />



                            {error && <p className='signup_error'>
                                {error}
                            </p>}

                            <p className='already_have_acc'>Already have an account? <a href='/login'>Log in</a></p>


                            <button type="submit" className='signup_button'>Register</button>


                        </form>

                    </div>
                </div>
            </div>}
        </div>
    );
}

export default Signup;


