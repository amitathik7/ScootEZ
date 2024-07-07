import React, { useEffect, useState } from 'react';
import styles from "./styles.css";

export default function LoginPage({displayStartCase}) {
    const [displayCase, setDisplayCase] = useState(displayStartCase);
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

    // button that creates a new account
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
    
    // button that switches between login box or create new account box
    // caseIndex 0=create new account, 1=login, 2=forgot password
    function SwitchButton({buttonText, caseIndex}) {
        function handleClick() {
            // change whether to display the login box or create new account box
            setDisplayCase(caseIndex);
        }
        return (
            <button className="button2" onClick={handleClick}>
                {buttonText}
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
    if (displayCase == 0) {
        return (
            <>
                {/* Draw a box */}
                <div className="loginBox">
                    <h1>Welcome!</h1>
                    <h2>Create your free account now!</h2> <br></br>

                    <label>
                        First name: <br></br>
                        <input className="input1"
                            value={name.firstName}
                            onChange={handleFirstNameChange}
                        />
                    </label> <br></br>
                    <label>
                        Last name: <br></br>
                        <input className="input1"
                            value={name.lastName}
                            onChange={handleLastNameChange}
                        />
                    </label> <br></br>
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
    
                    <CreateAccountButton/> <br></br>
                    <SwitchButton buttonText={"Already have an account? Login"} caseIndex={1}/> <br></br>
                    <SkipButton/> <br></br>
                </div>
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
                        <input className="input1"
                            value={loginInfo.email}
                            onChange={handleEmailChange}
                        />
                    </label> <br></br>
                    <label>
                        Password:
                        <input className="input1"
                            value={loginInfo.password}
                            onChange={handlePasswordChange}
                        />
                    </label> <br></br>
    
                    <LoginButton/> <br></br>
                    <SwitchButton buttonText={"New? Create an account"} caseIndex={0}/> <br></br>
                    <SkipButton/> <br></br>
                </div>
            </>
        );
    }


}
  