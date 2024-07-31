import React, { useEffect, useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App.js';
import styles from "../styles.css";

export default function EmployeeLoginPage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    // states
    const [isInvalidCredentials, setIsInvalidCredentials] = useState(false);
    const [isLoginButtonActive, setIsLoginButtonActive] = useState(false);

    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    // Profile state variables for logging in
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });


    const handleEmailChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            email: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            password: e.target.value
        });
    };


    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log(loginInfo);

        try {
            const response = await fetch(
                `http://localhost:5000/api/employee/login`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginInfo),
                }
            );

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem("token", data.token);
                setIsLoggedIn(true);
                navigate('/employee-dashboard'); 
            } else {
                setIsInvalidCredentials(true); 
                console.error('Login failed');
            }
        } catch (error) {
            setIsInvalidCredentials(true);
            console.error('Error during login:', error);
        }
    };

    function ValidateAllFields() {
        if (loginInfo.email.length <= 0 || loginInfo.password.length <= 0) {
            setIsLoginButtonActive(false);
        } else if (emailRef.current.validity.valid &&
            passwordRef.current.validity.valid) {
            setIsLoginButtonActive(true);
        } else {
            setIsLoginButtonActive(false);
        }
    }

    function ToggleShowPassword() {
        console.log("toggle clicked");
        if (passwordRef.current.type === "password") {
            passwordRef.current.type = "text";
        } else {
            passwordRef.current.type = "password";
        }
    }

    // shows the invalid message only if the showPasswordMessage state is true
    function InvalidCredentialsMessage() {
        if (isInvalidCredentials) {
            return (
                <p className="warningText">
                    &#9888; The email or password entered is invalid.
                </p>
            );
        } else {
            return (
                <div />
            );
        }
    }

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0px", paddingTop: "150px", paddingBottom: "150px" }}>
            <div style={{ width: "60%", display: "inline-block", lineHeight: "40px" }}>
                <h1>Employee Login</h1>
                <InvalidCredentialsMessage />
                <p>Email:</p>
                <input className="input1" required
                    type="email"
                    placeholder="Email"
                    ref={emailRef}
                    value={loginInfo.email}
                    onChange={handleEmailChange}
                    onInput={ValidateAllFields}
                />
                <p>Password:</p>
                <input className="input1" required
                    type="password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    placeholder="Password"
                    ref={passwordRef}
                    value={loginInfo.password}
                    onChange={handlePasswordChange}
                    onInput={ValidateAllFields}
                /> <br />
                <input type="checkbox" onClick={ToggleShowPassword} /> Show Password
                <br />
                <div style={{ marginTop: '20px' }}>
                    <button className="button1" onClick={handleLogin} disabled={!isLoginButtonActive}>
                        LOGIN
                    </button>
                </div>
            </div>
        </div>
    );
}