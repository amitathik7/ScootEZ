import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App.js';

export default function CreateEmployee() {
    // Global context
    const { setIsLoggedIn, setIsAdmin } = useContext(IsLoggedInContext);

    // States
    const [isIssueCreating, setIsIssueCreating] = useState(false);
    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [isCreateButtonActive, setIsCreateButtonActive] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

    // Get references to the HTML elements
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
        ValidateAllFields();
    }

    function handleLastNameChange(e) {
        setAccountInfo({
            ...accountInfo,
            lastName: e.target.value
        });
        ValidateAllFields();
    }

    function handleEmailChange(e) {
        setAccountInfo({
            ...accountInfo,
            email: e.target.value
        });
        ValidateAllFields();
    }

    function handlePasswordChange(e) {
        setAccountInfo({
            ...accountInfo,
            password: e.target.value
        });
        ValidatePassword();
        ValidateAllFields();
    }

    // Function that submits the info for the create new account
    async function CreateAccount() {
        try {
            console.log(accountInfo);

            const response = await fetch(
                'http://localhost:5000/api/admin/create_employee',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(accountInfo)
                }
            );
            if (response.ok) {
                // const data = await response.json(); // should return the token for the account
                // localStorage.setItem("token", data.token);
                // setIsLoggedIn(true);
                console.log('successful');
                setIsAdmin(true);
                return true;
            } else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            alert("An error occurred while creating the account; see console for details");
            console.error("error detected: ", error);
            return false;
        }
    }

    // Button component that logs into account
    function CreateEmployeeButton() {
        const navigate = useNavigate();
        function handleClick() {
            setIsCreateButtonActive(false);
            CreateAccount().then((isSuccess) => {
                if (isSuccess) {
                    navigate("/admin-dashboard");
                } else {
                    setIsCreateButtonActive(true);
                }
            });
        }

        return (
            <button className="button1" onClick={handleClick} disabled={!isCreateButtonActive}>
                CREATE EMPLOYEE
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
        if (passwordRef.current.type === "password") {
            passwordRef.current.type = "text";
        } else {
            passwordRef.current.type = "password";
        }
    }

    function IssueMessage() {
        return isIssueCreating ? (
            <p className="warningText">
                &#9888; Sorry, there was an issue creating your new account.
            </p>
        ) : null;
    }

    function PasswordMessage() {
        return showPasswordMessage ? (
            <div className="passwordMessage">
                <h3>Password must contain the following:</h3>
                <p ref={lowercaseRef} className="invalid">A <b>lowercase</b> letter</p>
                <p ref={capitalRef} className="invalid">An <b>uppercase</b> letter</p>
                <p ref={numberRef} className="invalid">A <b>number</b></p>
                <p ref={lengthRef} className="invalid">Minimum <b>8 characters</b></p>
            </div>
        ) : null;
    }

    return (
        <div className="fullBox">
            <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                <h2>Create a new employee account</h2>
                <IssueMessage />
                <div style={{ marginBottom: "20px" }} />
                <p>Employee First Name:</p>
                <input className="input1" required
                    type="text"
                    placeholder="Employee First Name"
                    ref={firstNameRef}
                    value={accountInfo.firstName}
                    onChange={handleFirstNameChange}
                />
                <p>Employee Last Name:</p>
                <input className="input1" required
                    type="text"
                    placeholder="Employee Last Name"
                    ref={lastNameRef}
                    value={accountInfo.lastName}
                    onChange={handleLastNameChange}
                />
                <p>Employee Email:</p>
                <input className="input1" required
                    type="email"
                    placeholder="Employee Email"
                    ref={emailRef}
                    value={accountInfo.email}
                    onChange={handleEmailChange}
                />
                <p>Password:</p>
                <input className="input1" required
                    type="password"
                    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                    placeholder="Password"
                    ref={passwordRef}
                    value={accountInfo.password}
                    onChange={handlePasswordChange}
                    onFocus={() => setShowPasswordMessage(true)}
                    onBlur={() => {
                        if (accountInfo.password.length <= 0 || passwordValidity) { setShowPasswordMessage(false); }
                    }}
                    onKeyUp={ValidatePassword}
                    onInput={ValidateAllFields}
                /> <br/>
                <input type="checkbox" onClick={ToggleShowPassword}/> Show Password
                <PasswordMessage />
                <div style={{ paddingTop: "20px" }}>
                    <CreateEmployeeButton />
                </div>
            </div>
        </div>
    );
}
