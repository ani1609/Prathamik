import React from 'react';
import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Logo from './images/pLogo.png';

function Login()
{
    const [data,setData]=useState({
        email:'',
        password:'',
    });

    const navigate=useNavigate();
    const [error,setError]=useState('');

    const handleChange=({currentTarget:input})=>{
        setData({...data,[input.name]:input.value}); 
    }

    const handleSubmit= async  (e)=>{
        e.preventDefault();
        try{
            const url='http://localhost:3000/login';
            const response=await axios.post(url,data);
            const res=response.data;
            localStorage.setItem('user', JSON.stringify(res));
            navigate('/');
            setError('');
            // console.log(res);
            // console.log(res.data);
            // console.log(res.message);
            
        }catch(error){
            if (error.response && error.response.status>=400 && error.response.status<500)
            {
                setError(error.response.data.message);
                console.log(error.response.data.message);
            }
        } 
    }

    const [shouldRender,setShouldRender]=useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => {
          setShouldRender(true);
        }, 100);
    
        return () => clearTimeout(timeout);
    }, []);

    return(
        <div>
            {shouldRender && <div className='login-container'>
                <div className='login_contents'>
                    <div className='login_left'>
                        <a href='/' className='login_logo'>
                            <img src={Logo}/>
                            <h1>Prathamik</h1>
                        </a>

                        <form onSubmit={handleSubmit} className='login_form'>

                            <h1>Welcome Back</h1>

                            <input
                                type="email"
                                placeholder='Email'
                                name="email"
                                id='login_email'
                                value={data.email}
                                onChange={handleChange}
                                required
                            />

                            <br></br>

                            <input
                                type="password"
                                placeholder='Password'
                                name="password"
                                id='login_password'
                                value={data.password}
                                onChange={handleChange}
                                required
                            />

                            <br></br>

                            {error && <p className='login_error'>
                                {error}
                            </p>}

                            <p className='dont_have_acc'>Don't have an account? <a href='/signup'>Get one</a></p>

                            <button type="submit" className='login_button'>Login</button>
                        </form>
                        </div>
                </div>
            </div>}
        </div>
    );
}

export default Login;

