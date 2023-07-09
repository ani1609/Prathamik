import React from 'react';
import './Login.css';

function Login()
{
    return(
        <div className='login-container'>
            <form>
                <label htmlFor='email'>Email:</label><br></br>
                <input type="email" id='email' name="email" required /><br></br>

                <label htmlFor='password'>Password:</label><br></br>
                <input type="password" id='password' name="password" required /><br></br>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;