import React from 'react';
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

function Login()
{
    const [data,setData]=useState({
        email:'',
        password:'',
    });

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
            // console.log(res);
            console.log(res.data);
            console.log(res.message);
            
        }catch(error){
            if (error.response && error.response.status>=400 && error.response.status<500)
            {
                setError(error.response.data.message);
                console.log(error.response.data.message);
            }
        } 
    }

    return(
        <div className='signup-container'>
            <form onSubmit={handleSubmit}>

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

                {error && <div className='error'>
                    {error}
                </div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;

