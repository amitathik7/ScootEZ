import React, { useEffect, useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountContext, IsLoggedInContext } from '../App.js';
import styles from "../styles.css";

export default function CreateAccountPage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);
    const { account, setAccount } = useContext(AccountContext);

    // states
    const [isIssueCreating, setIsIssueCreating] = useState(false);
    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [isCreateButtonActive, setIsCreateButtonActive] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

    // get references to the HTML elements
    const lowercaseRef = useRef(null);
    const capitalRef = useRef(null);
    const numberRef = useRef(null);
    const lengthRef = useRef(null);

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

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

    // function that submits the info for the create new account
    async function CreateAccount() {
        try {
            console.log(accountInfo);

            const response = await fetch(
                'http://localhost:5000/api/users/create',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(accountInfo)
                }
            );
            if (response.ok) {
                const data = await response.json(); // should return the token for the account
                localStorage.setItem("token", data.token);
                setIsLoggedIn(true);
                setAccount("User name");    //FIXME TO ACTUALLY BE THE USER'S NAME
                return true;
            }
            else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            alert("An error occured while logging in; see console for details");
            console.error("error detected: ", error);
            return false;
        }
    }

    // button that logs into account
    function CreateAccountButton() {
        const navigate = useNavigate();
        function handleClick() {
            setIsCreateButtonActive(false);
            CreateAccount().then((isSuccess) => {
                if (isSuccess){
                    navigate("/profile", {});
                }
                else {
                    setIsCreateButtonActive(true);
                }
            })   
        }

        // button is active if both fields are true
        if (isCreateButtonActive){
            return (
                <button className="button1" onClick={handleClick}>
                    CREATE ACCOUNT
                </button>
            );
        }
        // button is disabled if either field is invalid
        else {
            return (
                <button className="button1" disabled="true">
                    CREATE ACCOUNT
                </button>
            );
        }
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

    function ValidateAllFields() {
        if (accountInfo.firstName.length <= 0 ||
            accountInfo.lastName.length <= 0 ||
            accountInfo.email.length <= 0 ||
            accountInfo.password.length <=0)
        {
            setIsCreateButtonActive(false);
        }
        if (firstNameRef.current.validity.valid &&
            lastNameRef.current.validity.valid &&
            emailRef.current.validity.valid &&
            passwordRef.current.validity.valid)
        {
            setIsCreateButtonActive(true);
        }
        else {
            setIsCreateButtonActive(false);
        }
    }

    function ValidatePassword() {
        // validate letters
        var lowerCaseLetters = /[a-z]/g;
        if(accountInfo.password.match(lowerCaseLetters)) {
            lowercaseRef.current.className = "valid";
        } else {
            lowercaseRef.current.className = "invalid";
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(accountInfo.password.match(upperCaseLetters)) {
            capitalRef.current.className = "valid";
        } else {
            capitalRef.current.className = "invalid";
        }

        // validate numbers
        var numbers = /[0-9]/g;
        if(accountInfo.password.match(numbers)) {
            numberRef.current.className = "valid";
        } else {
            numberRef.current.className = "invalid";
        }

        // Validate length
        if(accountInfo.password.length >= 8) {
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

    // shows the invalid message only if the showPasswordMessage state is true
    function IssueMessage() {
        if (isIssueCreating) {
            return (
                <p className="warningText">
                    &#9888; Sorry, there was an issue creating your new account.
                </p>
            );
        }
        else {
            return (
                <div />
            );
        }
    }

    // shows the password message only if the showPasswordMessage state is true
    function PasswordMessage() {
        if (showPasswordMessage) {
            return (
                <div className="passwordMessage">
                    <h3>Password must contain the following:</h3>
                    <p ref={lowercaseRef} className="invalid">A <b>lowercase</b> letter</p>
                    <p ref={capitalRef} className="invalid">An <b>uppercase</b> letter</p>
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
    

    return (
        <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Welcome!</h1>
                <h2>Create your account!</h2>
                <IssueMessage />
                <p>First Name:</p>
                <input className="input1" required
                    type="text"
                    placeholder="First Name"
                    ref={firstNameRef}
                    value={accountInfo.firstName}
                    onChange={handleFirstNameChange}
                />
                <p>Last Name:</p>
                <input className="input1" required
                    type="text"
                    placeholder="Last Name"
                    ref={lastNameRef}
                    value={accountInfo.lastName}
                    onChange={handleLastNameChange}
                />
                <p>Email:</p>
                <input className="input1" required
                    type="email"
                    placeholder="Email"
                    ref={emailRef}
                    value={accountInfo.email}
                    onChange={handleEmailChange}
                    onInput={ValidateAllFields}
                />
                <p>Password:</p>
                <input className="input1" required
                    type="password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    placeholder="Password"
                    ref={passwordRef}
                    value={accountInfo.password}
                    onChange={handlePasswordChange}
                    onFocus={() => {setShowPasswordMessage(true)}}
                    onBlur={() => {
                        if(accountInfo.password.length <= 0 || passwordValidity) {setShowPasswordMessage(false)}
                    }}
                    onKeyUp={ValidatePassword}
                    onInput={ValidateAllFields}
                /> <br/>
                <input type="checkbox" onClick={ToggleShowPassword}/> Show Password
                <PasswordMessage />
                <CreateAccountButton/> <br></br>
                <SwitchButton /> <br></br>
            </div>
        </div>
    );


}
  