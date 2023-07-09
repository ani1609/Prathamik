import React from 'react';
import './Signup.css';

function Signup()
{
    return(
        <div className='signup-container'>
            <form>
                <label htmlFor='name'>Full Name:</label><br></br>
                <input type="text" id='name' name="name" required/><br></br>

                <label htmlFor='email'>Email:</label><br></br>
                <input type="email" id='email' name="email" required/><br></br>

                <label htmlFor='password'>Password:</label><br></br>
                <input type="password" id='password' name="password" required/><br></br>

                <label htmlFor='confirm_password'>Confirm Password:</label><br></br>
                <input type="password" id='confirm_password' name="confirm_password" required/><br></br>

                <button type="submit">Register</button>
            </form>
        </div>
    );
}

export default Signup;