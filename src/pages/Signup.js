import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils';

const Signup = () => {
    const [signupInfo, setSignupInfo] = useState({
        userName: '',
        name: '',
        mobile: '',
        role: '',
        password: '',
        disabled: true,
        verified: true,
        createdAt: new Date().toISOString(),
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignupInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        const { userName, name, mobile, password } = signupInfo;

        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(userName)) {
            return handleError('Please enter valid mail');
        }
        if (!userName || !name || !mobile || !password) {
            return handleError('userName, name, mobile, and password are required');
        }
        console.log('Signup Info:', signupInfo);

        try {
            const url = "http://103.189.80.13:9091/api/v1/auth/Register";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...signupInfo,
                    mobile: Number(mobile),
                   
                })
            });
            if (!response.ok) {
                const error = await response.json(); 
                console.error('Response Error:', error);
                return handleError('Server error: ' + error);
            }
    
            const result = await response.json();
            console.log('Parsed Result:', result);
            const {message, error } = result;
            if (response.ok) {
                handleSuccess("Signup Successful!");
                setTimeout(() => {
                    navigate('/login');
                }, 1000);
            } else if (error) {
                const details = error?.details[0]?.message || 'An error occurred';
                handleError(details);
            } else {
                handleError(message || 'An unknown error occurred');
            }
        } 
        catch (error) {
            console.error('Fetch Error:', error);
            handleError(error.message || 'Something went wrong');
        }
    };


    return (
        <div className='container'>
            <h1>Signup</h1>
            <form onSubmit={handleSignup}>
                <div>
                    <label htmlFor='userName'>User Name</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='userName'
                        autoFocus
                        placeholder='Enter your email'
                        value={signupInfo.userName}
                    />
                </div>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='name'
                        placeholder='Enter your name'
                        value={signupInfo.name}
                    />
                </div>
                <div>
                    <label htmlFor='mobile'>Mobile Number</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='mobile'
                        placeholder='Enter your mobile number'
                        value={signupInfo.mobile}
                    />
                </div>
                <div>
                    <label htmlFor='role'>Role</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='role'
                        placeholder='Enter your role'
                        value={signupInfo.role}
                    />
                </div>

                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password'
                        value={signupInfo.password}
                    />
                </div>
                <button type='submit'>Signup</button>

                <span>Already have an account?
                    <Link to="/login"> Login</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Signup;
