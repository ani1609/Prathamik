import React from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';

function Signup()
{
    const [data,setData]=useState({
        name:'',
        email:'',
        password:'',
        confirm_password:''
    });

    const [error,setError]=useState('');
    const navigate=useNavigate();

    const handleChange=({currentTarget:input})=>{
        setData({...data,[input.name]:input.value}); 
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = 'http://localhost:3000/signup';
            const response = await axios.post(url, data);
            //   const res=response.data;
            //   navigate('/login');
            console.log(response.data.message);
            setError('');
        } catch (error) {
            if (error.response && error.response.status >= 400 && error.response.status < 500) {
                setError(error.response.data.message);
          }
        }
    };
      
    return(
        <div className='signup-container'>
            <form onSubmit={handleSubmit}>
                <label htmlFor='name'>Full Name:</label><br></br>
                <input
                    type="text"
                    placeholder='Name'
                    name="name"
                    value={data.name}
                    onChange={handleChange}
                    required
                />

                <br></br>

                <input
                    type="email"
                    placeholder='Email'
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    required
                />

                <br></br>

                <input
                    type="password"
                    placeholder='Password'
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    required
                />

                <br></br>

                <input
                    type="password"
                    placeholder='Confirm Password'
                    name="confirm_password"
                    value={data.confirm_password}
                    onChange={handleChange}
                    // required
                />

                <br></br>
                {error && <div className='error'>
                    {error}
                </div>}
                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Signup;


