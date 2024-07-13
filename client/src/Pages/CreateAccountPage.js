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
            CreateAccount();
        }
        return (
            <button className="button1" onClick={handleClick}>
                CREATE ACCOUNT
            </button>
        );
    }

    // function that submits the info for the create new account
    async function CreateAccount() {
        const accountData = {
            firstName: accountInfo.firstName,
            lastName: accountInfo.lastName,
            email: accountInfo.email,
            password: accountInfo.password
        };

        console.log(JSON.stringify(accountData));

        try {
            const res = await fetch('http://localhost:5000/api/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(accountData)
            });
    
            if (!res.ok) {
                throw new Error('Problem with backend response: ' + res.statusText);
            }
        } catch (error) {
            console.error('Error with creating new account ==>', error);
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
    

    return (
        <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Welcome!</h1>
                <h2>Create your account!</h2>
                <p>First Name:</p>
                <input className="input1"
                    value={accountInfo.firstName}
                    onChange={handleFirstNameChange}
                />
                <p>Last Name:</p>
                <input className="input1"
                    value={accountInfo.lastName}
                    onChange={handleLastNameChange}
                />
                <p>Email:</p>
                <input className="input1"
                    value={accountInfo.email}
                    onChange={handleEmailChange}
                />
                <p>Password:</p>
                <input className="input1"
                    value={accountInfo.password}
                    onChange={handlePasswordChange}
                />

                <CreateAccountButton/> <br></br>
                <SwitchButton /> <br></br>
            </div>
        </div>
    );


}
  