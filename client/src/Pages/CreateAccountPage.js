import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "../styles.css";

export default function CreateAccountPage() {
    // Profile state variables for name (only use for creating new account)
    const [accountInfo, setAccountInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    function handleFirstNameChange(e) {
        setAccountInfo({
            ...accountInfo,
            firstName: e.target.value
        });
    }
    function handleLastNameChange(e) {
        setAccountInfo({
            ...accountInfo,
            lastName: e.target.value
        });
    }
    function handleEmailChange(e) {
        setAccountInfo({
            ...accountInfo,
            email: e.target.value
        });
    }
    function handlePasswordChange(e) {
        setAccountInfo({
            ...accountInfo,
            password: e.target.value
        });
    }

    // button that logs into account
    function CreateAccountButton() {
        function handleClick() {
            alert('create account clicked.');
            CreateAccount();
        }
        return (
            <button className="button1" onClick={handleClick}>
                Login
            </button>
        );
    }

    // function that submits the info for the create new account
    async function CreateAccount() {
        //e.preventDefault();
    
        console.log(accountInfo);
    
        const response = await fetch(
            
            `http://localhost:5000/api?firstName_input=${accountInfo.firstName}&lastName=${accountInfo.lastName}&email_input=${accountInfo.email}&password_input=${accountInfo.password}`,
            {
                method: 'GET'
            }
        );
    }


    
    // button that switches between login box or create new account box
    // caseIndex 0=create new account, 1=login, 2=forgot password
    function SwitchButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/login", {})
        }
        return (
            <button className="button2" onClick={handleClick}>
                Already have an account? Login here
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
                    <h1>Welcome!</h1>
                    <h1>Create your account!</h1>
                    <label>
                        First Name:
                        <input className="input1"
                            value={accountInfo.firstName}
                            onChange={handleFirstNameChange}
                        />
                    </label> <br></br>
                    <label>
                        Last Name:
                        <input className="input1"
                            value={accountInfo.lastName}
                            onChange={handleLastNameChange}
                        />
                    </label> <br></br>
                    <label>
                        Email:
                        <input className="input1"
                            value={accountInfo.email}
                            onChange={handleEmailChange}
                        />
                    </label> <br></br>
                    <label>
                        Password:
                        <input className="input1"
                            value={accountInfo.password}
                            onChange={handlePasswordChange}
                        />
                    </label> <br></br>
    
                    <CreateAccountButton/> <br></br>
                    <SwitchButton /> <br></br>
                    <SkipButton/> <br></br>
                </div>
            </>
        );


}
  