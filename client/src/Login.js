import React, { useEffect, useState } from 'react';
import styles from "./styles.css";

export default function LoginPage() {
    const [displayCase, setDisplayCase] = useState(0);
    // Profile state variables for name (only use for creating new account)
    const [name, setName] = useState({
        firstName: '',
        lastName: '',
    });
    function handleFirstNameChange(e) {
        setName({
            ...name,
            firstName: e.target.value
        });
    }
    function handleLastNameChange(e) {
        setName({
            ...name,
            lastName: e.target.value
        });
    }
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

    // buttons
    function CreateAccountButton() {
        function handleClick() {
            alert('create account clicked.');
        }
        return (
            <button className="button1" onClick={handleClick}>
                Create Account
            </button>
        );
    }
    
    function LoginButton() {
        function handleClick() {
            alert('login clicked.');
            setDisplayCase(1);
        }
        return (
            <button className="button2" onClick={handleClick}>
                Already have an account? Login
            </button>
        );
    }
    
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
    if (displayCase == 0) {
        return (
            <>
                {/* Draw a box */}
                <div className="loginBox">
                    <h1>Welcome!</h1>
                    <h2>Create your free account now!</h2>
                    <label>
                        First name:
                        <input
                            value={name.firstName}
                            onChange={handleFirstNameChange}
                        />
                    </label> <br></br>
                    <label>
                        Last name:
                        <input
                            value={name.lastName}
                            onChange={handleLastNameChange}
                        />
                    </label> <br></br>
                    <label>
                        Email:
                        <input
                            value={loginInfo.email}
                            onChange={handleEmailChange}
                        />
                    </label> <br></br>
                    <label>
                        Password:
                        <input
                            value={loginInfo.password}
                            onChange={handlePasswordChange}
                        />
                    </label> <br></br>
    
                    <CreateAccountButton/> <br></br>
                    <LoginButton/> <br></br>
                    <SkipButton/> <br></br>
                </div>
    
                <p>
                    This is a debug check: <br></br>
                    firstname: {name.firstName} <br></br>
                    lastname: {name.lastName} <br></br>
                    email: {loginInfo.email} <br></br>
                    password: {loginInfo.password}
                </p>
            </>
        );
    }
    else {
        return (
            <>
                {/* Draw a box */}
                <div className="loginBox">
                    <h1>Welcome back!</h1>
                    <label>
                        Email:
                        <input
                            value={loginInfo.email}
                            onChange={handleEmailChange}
                        />
                    </label> <br></br>
                    <label>
                        Password:
                        <input
                            value={loginInfo.password}
                            onChange={handlePasswordChange}
                        />
                    </label> <br></br>
    
                    <CreateAccountButton/> <br></br>
                    <LoginButton/> <br></br>
                    <SkipButton/> <br></br>
                </div>
    
                <p>
                    This is a debug check: <br></br>
                    email: {loginInfo.email} <br></br>
                    password: {loginInfo.password}
                </p>
            </>
        );
    }


}
  