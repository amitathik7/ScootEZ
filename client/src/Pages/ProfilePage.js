import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate} from 'react-router-dom';

import { ReactComponent as PencilIcon} from '../assets/pencilIcon.svg';
import { IsLoggedInContext } from '../App.js';


export default function ProfilePage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    async function AuthenticateUser() {
        try {    
            console.log("in the fetch request");
          const response = await fetch('http://localhost:5000/api/token/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
          });
          const {message} = await response.json(); // this will return true or false in "status"
          console.log(message);
          return message;
        }
        catch (error) {
          console.error("error encountered in authenticating the token" + error);
          return false;
        }
    }
    
    // if (localStorage.getItem("token") != null) {
    //     console.log("authenticating...");
    //     AuthenticateUser().then((result) => {
    //         console.log("setting state variable")
    //         if (result) { setIsLoggedIn(true) }
    //         else { setIsLoggedIn(false) }
    //     });
    // }

    // states
    const [isFirstNameActive, setIsFirstNameActive] = useState(false);
    const [isLastNameActive, setIsLastNameActive] = useState(false);
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [isAddressActive, setIsAddressActive] = useState(false);
    const [isCardActive, setIsCardActive] = useState(false);

    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);


    // Profile state variables for name (only use for creating new account)
    const [accountInfo, setAccountInfo] = useState({
        firstName: 'Jay',
        lastName: 'Holt',
        email: 'jh@mail.com',
        password: 'encryped text here',
        address: '',
        creditCard: ''
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
    function handleAddressChange(e) {
        setAccountInfo({
            ...accountInfo,
            address: e.target.value
        });
    }
    function handleCardChange(e) {
        setAccountInfo({
            ...accountInfo,
            creditCard: e.target.value
        });
    }

    // get account information from backend
    async function getAccountData() {
        try {    
            const response = await fetch('http://localhost:5000/api/users/accountInfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            });
            const accountInfo = await response.json();
            // account Info is an object of { firstName, lastName, email, password, address, creditCard }
            return accountInfo;    
        }
        catch (error) {
            console.error("error encountered in getting the account info" + error);
        }
    }

    async function SaveAccountData() {
        try {
            console.log(accountInfo);

            const response = await fetch(
                'http://localhost:5000/api/users/update',
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(accountInfo)
                }
            );
            if (response.ok) {
                return true;
            }
            else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            alert("An error occured while saving changes; see console for details");
            console.error("error detected: ", error);
            return false;
        }
    }

    async function DeleteAccount() {
        try {
            const response = await fetch(
                'http://localhost:5000/api/users/delete',
                {
                    method: "DELETE",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.ok) {
                return true;
            }
            else {
                throw new Error(response.statusText);
            }
        } catch (error) {
            alert("An error occured while deleting account; see console for details");
            console.error("error detected: ", error);
            return false;
        }
    }

    // button that saves the changed account info
    function SaveChangesButton() {
        function handleClick() {
            SaveAccountData().then((isSuccess) => {
                if (isSuccess){
                    alert("Successfuly saved changes to your account");
                }
                else {
                    alert("Failed to save changes to your account");
                }
            })   
        }
        return (
            <button className="button1" onClick={handleClick}>
                SAVE
            </button>
        );
    }

    // button that saves the changed account info
    function DeleteAccountButton() {
        const navigate = useNavigate();
        function handleClick() {
            DeleteAccount().then((isSuccess) => {
                if (isSuccess){
                    alert("Successfuly deleted your account");
                    localStorage.removeItem("token");   //delete token
                    navigate("/", {});  // navigate home
                }
                else {
                    alert("Failed to save changes to your account");
                }
            })   
        }
        return (
            <button className="button3" onClick={handleClick}>
                DELETE ACCOUNT
            </button>
        );
    }

    // shows the invalid message only if the showPasswordMessage state is true
    function IssueMessage() {
        if (true) {
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

    // get references to the HTML elements
    const lowercaseRef = useRef(null);
    const capitalRef = useRef(null);
    const numberRef = useRef(null);
    const lengthRef = useRef(null);
    const passwordRef = useRef(null);


    // validate if the password meets requirements
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
        if (passwordRef.current.validity.valid) {
            setPasswordValidity(true);
        }
        else {
            setPasswordValidity(false);
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

    // if the password is hidden or shows as text
    function ToggleShowPassword() {
        console.log("toggle clicked");
        if (passwordRef.current.type === "password") {
            passwordRef.current.type = "text";
        } else {
            passwordRef.current.type = "password";
        }
    }
    
    if (isLoggedIn) {
        // call get account info immediately and set it in the state
        getAccountData().then((data) => { setAccountInfo(data) });

        return (
            <div className="fullBox gray">
                <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>My Profile</h1>
                    <p>First Name:</p>
                    <input className="input2" disabled={ isFirstNameActive ? false : true } required
                        type="text"
                        placeholder="First Name"
                        value={accountInfo.firstName}
                        onChange={handleFirstNameChange}
                    />
                    <button className="button4" onClick={() => setIsFirstNameActive((props) => !props)}>
                        <PencilIcon style={{ height: "30px", fill: "black" }} />
                    </button>

                    <p>Last Name:</p>
                    <input className="input2" disabled={ isLastNameActive ? false : true } required
                        type="text"
                        placeholder="Last Name"
                        value={accountInfo.lastName}
                        onChange={handleLastNameChange}
                    />
                    <button className="button4" onClick={() => setIsLastNameActive((props) => !props)}>
                        <PencilIcon style={{ height: "30px", fill: "black" }} />
                    </button>

                    <p>Email:</p>
                    <input className="input2" disabled={ isEmailActive ? false : true } required
                        type="email"
                        placeholder="Email"
                        value={accountInfo.email}
                        onChange={handleEmailChange}
                    />
                    <button className="button4" onClick={() => setIsEmailActive((props) => !props)}>
                        <PencilIcon style={{ height: "30px", fill: "black" }} />
                    </button>

                    <p>Password:</p>
                    <input className="input2" disabled={ isPasswordActive ? false : true } required
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        placeholder="Password"
                        ref={passwordRef}
                        value={accountInfo.password}
                        onChange={handlePasswordChange}
                        onFocus={() => {setShowPasswordMessage(true)}}
                        onBlur={() => {
                            if(passwordValidity) {setShowPasswordMessage(false)}
                        }}
                        onKeyUp={ValidatePassword}
                    />
                    <button className="button4" onClick={() => setIsPasswordActive((props) => !props)}>
                        <PencilIcon style={{ height: "30px", fill: "black" }} />
                    </button>
                    <br/>
                    <input type="checkbox" onClick={ToggleShowPassword}/> Show Password
                    <PasswordMessage />

                    <p>Address:</p>
                    <input className="input2" disabled={ isAddressActive ? false : true }
                        type="text"
                        placeholder="Address"
                        value={accountInfo.address}
                        onChange={handleAddressChange}
                    />
                    <button className="button4" onClick={() => setIsAddressActive((props) => !props)}>
                        <PencilIcon style={{ height: "30px", fill: "black" }} />
                    </button>

                    <p>Payment:</p>
                    <input className="input2" disabled={ isCardActive ? false : true}
                        type="text"
                        placeholder="FIXME - multiple fields"
                        value={accountInfo.creditCard}
                        onChange={handleCardChange}
                    />
                    <button className="button4" onClick={() => setIsCardActive((props) => !props)}>
                        <PencilIcon style={{ height: "30px", fill: "black" }} />
                    </button> <br/>

                    <SaveChangesButton /> <br/>
                    <DeleteAccountButton />
                </div>
            </div>
        );
    }
    else {
        return (
            <Navigate to='/login' />
        );
    }
}