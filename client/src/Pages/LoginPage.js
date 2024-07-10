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

    return (
        <div style={{width: "100%", height: "100%", display: "flex", justifyContent:"space-between", margin: "0px"}}>
            <div className="leftBox">
                <div style={{width: "60%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>Welcome Back!</h1>
                    <p>Email:</p>
                    <input className="input1"
                        value={loginInfo.email}
                        onChange={handleEmailChange}
                    />
                    <p>Password:</p>
                    <input className="input1"
                        value={loginInfo.password}
                        onChange={handlePasswordChange}
                    />

                    <LoginButton /> <br></br>
                </div>
            </div>
            <div className="rightBox">
                <div style={{width: "80%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>New here?</h1>
                    <h2>Create your free account here!</h2>
                    <SwitchButton /> <br></br>
                </div>
            </div>
        </div>
    );


}
  