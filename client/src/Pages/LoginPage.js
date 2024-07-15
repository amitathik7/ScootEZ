import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles.css";

export default function LoginPage() {
    // global context
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
        try {
            console.log(loginInfo);
    
            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(loginInfo)
                }
            );
            if (response.ok) {
                const data = await response.json(); // should return the token for the account
                localStorage.setItem("token", data.token);
                return true;
            }
            else {
                console.log("invalid credentials");
                return false;
            }
        }
        catch (error) {
            console.error("error detected: ", error);
            return false;
        }
        
    }

    // button that logs into account
    function LoginButton() {
        const navigate = useNavigate();
        function handleClick() {
            setIsLoginButtonActive(false);
            Login().then((isSuccess) => {
                if (isSuccess){
                    navigate("/map", {});
                }
                else {
                    setIsInvalidCredentials(true);
                    setIsLoginButtonActive(true);
                }
            })           
        }

        // button is active if both fields are true
        if (isLoginButtonActive){
            return (
                <button className="button1" onClick={handleClick}>
                    LOGIN
                </button>
            );
        }
        // button is disabled if either field is invalid
        else {
            return (
                <button className="button1" disabled="true">
                    LOGIN
                </button>
            );
        }
    }
    
    // button that switches to the createaccount page
    function SwitchButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/create-account", {});
        }
        return (
            <button className="button1" onClick={handleClick}>
                CREATE ACCOUNT
            </button>
        );
    }

    function ValidateAllFields() {
        if (loginInfo.email.length <= 0 || loginInfo.password.length <=0){
            setIsLoginButtonActive(false);
        }
        else if (emailRef.current.validity.valid &&
            passwordRef.current.validity.valid)
        {
            setIsLoginButtonActive(true);
        }
        else {
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
        }
        else {
            return (
                <div />
            );
        }
    }

    // conditional rendering for the form:
    return (
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent:"space-between", margin: "0px"}}>
            <div className="leftBox">
                <div style={{width: "60%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>Welcome Back!</h1>
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
                    /> <br/>
                    <input type="checkbox" onClick={ToggleShowPassword}/> Show Password
                    <br/>
                    <LoginButton />
                </div>
            </div>
            <div className="rightBox">
                <div style={{width: "80%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>New?</h1>
                    <h2>Create your free account now!</h2>
                    <SwitchButton /> <br></br>
                </div>
            </div>
        </div>
    );


}
  