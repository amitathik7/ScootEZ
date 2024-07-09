import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles.css";

export default function LoginPage() {
    // Profile state variables for logging in
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });
    function handleEmailChange(e) {
        setLoginInfo({
            ...loginInfo,
            email: e.target.value
        });
    }
    function handlePasswordChange(e) {
        setLoginInfo({
            ...loginInfo,
            password: e.target.value
        });
    }

    // function that submits the info for the create new account
    async function Login() {
        //e.preventDefault();
    
        console.log(loginInfo);
    
        const response = await fetch(
            
            `http://localhost:5000/api?email_input=${loginInfo.email}&password_input=${loginInfo.password}`,
            {
                method: 'GET'
            }
        );
    }

    // button that logs into account
    function LoginButton() {
        function handleClick() {
            alert('create account clicked.');
            Login();
        }
        return (
            <button className="button1" onClick={handleClick}>
                Login
            </button>
        );
    }
    
    // button that switches to the createaccount page
    function SwitchButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/create-account", {})
        }
        return (
            <button className="button2" onClick={handleClick}>
                Dont have an account? Create one now!
            </button>
        );
    }
    
    // button that skips the login process
    function SkipButton() {
        function handleClick() {
            alert('skip for now clicked.');
        }
        return (
            <button className="button3" onClick={handleClick}>
                Skip for now
            </button>
        );
    }

    return (
        <>
            {/* Draw a box */}
            <div className="loginBox">
                <h1>Welcome Back!</h1>
                <label>
                    Email: <br></br>
                    <input className="input1"
                        value={loginInfo.email}
                        onChange={handleEmailChange}
                    />
                </label> <br></br>
                <label>
                    Password: <br></br>
                    <input className="input1"
                        value={loginInfo.password}
                        onChange={handlePasswordChange}
                    />
                </label> <br></br>

                <LoginButton/> <br></br>
                <SwitchButton /> <br></br>
                <SkipButton/> <br></br>
            </div>
        </>
    );


}
  