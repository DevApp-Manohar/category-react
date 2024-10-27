import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleError, handleSuccess } from '../utils';

const BaseUrl = "http://103.189.80.13:9091/";
const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prevInfo => ({
            ...prevInfo,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const {username, password } = loginInfo;
        
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(username)) {
            return handleError('Invalid User','Please enter valid username');
        }

        if (!username || !password) {
            return handleError('username, and password are required');
        }
        console.log('userName:',username,'password:',password);

        try {
            const url = `${BaseUrl}api/v1/auth/Login?username=${username}&password=${password}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            if (!response.ok) {
                const error = await response.json(); 
                console.error('Response Error:', error);
                return handleError('Server error: ' + error);
            }
            const result = await response.json();
            console.log("result", result);
            const { message, token, error} = result;
            if (response.ok) {
                handleSuccess("Login Successful!");
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', username);
                setTimeout(()=>{
                     navigate('/home')
                },1000)
                console.log("jwtToken==", token);
            }else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            }else 
                handleError(message);
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>    
                <div>
                    <label htmlFor='username'>User Name</label>
                    <input
                        onChange={handleChange}
                        type='email'
                        name='username'
                        placeholder='Enter your email'
                        value={loginInfo.username}
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type='password'
                        name='password'
                        placeholder='Enter your password'
                        value={loginInfo.password}
                    />
                </div>
                
                <button type='submit'>Login</button>
                <span>Don't have an account ?
                    <Link to="/signup"> Signup</Link>
                </span>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
