import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles.css";

export default function LoginPage() {
    // set login states
    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

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
            const data = await response.json();
            
            if (response.ok) {
                alert("success");
                localStorage.setItem("token", data.token);
            }
            else {
                alert(data.message);
            }
        }
        catch (error) {
            alert("An error occured while logging in");
            console.error("error detected: ", error);
        }
        
    }

    // button that logs into account
    function LoginButton() {
        function handleClick() {
            Login();
        }
        return (
            <button className="button1" onClick={handleClick}>
                LOGIN
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
            <button className="button1" onClick={handleClick}>
                CREATE ACCOUNT
            </button>
        );
    }

    // get references to the HTML elements
    const lowercaseRef = useRef(null);
    const capitalRef = useRef(null);
    const numberRef = useRef(null);
    const lengthRef = useRef(null);
    const passwordRef = useRef(null);
    const emailRef = useRef(null);

    function ValidatePassword() {
        // validate letters
        var lowerCaseLetters = /[a-z]/g;
        if(loginInfo.password.match(lowerCaseLetters)) {
            lowercaseRef.current.className = "valid";
        } else {
            lowercaseRef.current.className = "invalid";
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(loginInfo.password.match(upperCaseLetters)) {
            capitalRef.current.className = "valid";
        } else {
            capitalRef.current.className = "invalid";
        }

        // validate numbers
        var numbers = /[0-9]/g;
        if(loginInfo.password.match(numbers)) {
            numberRef.current.className = "valid";
        } else {
            numberRef.current.className = "invalid";
        }

        // Validate length
        if(loginInfo.password.length >= 8) {
            lengthRef.current.className = "valid";
        } else {
            lengthRef.current.className = "invalid";
        }

        // set passwordValidity
        if (passwordRef.current.className === "valid") {
            setPasswordValidity(true);
        }
        else {
            setPasswordValidity(false);
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

    // shows the password message only if the showPasswordMessage state is true
    function PasswordMessage() {
        if (showPasswordMessage) {
            return (
                <div className="passwordMessage">
                    <h3>Password must contain the following:</h3>
                    <p ref={lowercaseRef} className="invalid">A <b>lowercase</b> letter</p>
                    <p ref={capitalRef} className="invalid">A <b>capital (uppercase)</b> letter</p>
                    <p ref={numberRef} className="invalid">A <b>number</b></p>
                    <p ref={lengthRef} className="invalid">Minimum <b>8 characters</b></p>
                </div>
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
                    <p>Email:</p>
                    <input className="input1" required
                        type="email"
                        placeholder="Email"
                        ref={emailRef}
                        value={loginInfo.email}
                        onChange={handleEmailChange}
                    />
                    <p>Password:</p>
                    <input className="input1" required
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        placeholder="Password"
                        ref={passwordRef}
                        value={loginInfo.password}
                        onChange={handlePasswordChange}
                        onFocus={() => {setShowPasswordMessage(true)}}
                        onBlur={() => {
                            if(loginInfo.password.length <= 0 || passwordValidity) {setShowPasswordMessage(false)}
                        }}
                        onKeyUp={ValidatePassword}
                    /> <br/>
                    <input type="checkbox" onClick={ToggleShowPassword}/> Show Password
                    <PasswordMessage />
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
  