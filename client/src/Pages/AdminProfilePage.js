import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate } from 'react-router-dom';

import { ReactComponent as PencilIcon } from '../assets/pencilIcon.svg';
import { IsLoggedInContext } from '../App.js';


export default function AdminProfilePage() {

    //#region STATES, CONTEXT, REFS =====================================================================================

    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    // states
    const [isAuthenticated, setIsAuthenticated] = useState('fetching');
    const [needsAccountData, setNeedsAccountData] = useState(true);

    const [isFirstNameActive, setIsFirstNameActive] = useState(false);
    const [isLastNameActive, setIsLastNameActive] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);

    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    function handleOldPasswordChange(e) {
        setOldPassword(e.target.value);
    }

    const [oldPasswordValid, setOldPasswordValid] = useState(false);

    const [isConfirmationBoxOpen, setIsConfirmationBoxOpen] = useState(false);

    const [confirmationMessageStatus, setConfirmationMessageStatus] = useState('closed');

    // Profile state variables for name (only use for creating new account)
    const [fieldInfo, setFieldInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    function handleFirstNameChange(e) {
        setFieldInfo({
            ...fieldInfo,
            firstName: e.target.value
        });
    }
    function handleLastNameChange(e) {
        setFieldInfo({
            ...fieldInfo,
            lastName: e.target.value
        });
    }
    function handlePasswordChange(e) {
        setFieldInfo({
            ...fieldInfo,
            password: e.target.value
        });
    }

    // get references to the HTML elements
    const lowercaseRef = useRef(null);
    const capitalRef = useRef(null);
    const numberRef = useRef(null);
    const lengthRef = useRef(null);

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const oldPasswordRef = useRef(null);
    const passwordRef = useRef(null);

    //#endregion =================================================================================================

    //#region BACKEND ASYNC FUNCTIONS ===================================================================================
    async function AuthenticateUser() {
        // if the token doesn't exist...
        if (localStorage.getItem("token") == null) {
            return false;
        }
        try {
            console.log("in the fetch request");
            const response = await fetch('http://localhost:5000/api/token/verify/admin', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            });
            const { message } = await response.json(); // this will return true or false in "status"
            return message;
        }
        catch (error) {
            console.error("error encountered in authenticating the token" + error);
            return false;
        }
    }

    // get account information from backend
    async function getAccountData() {
        try {
            const response = await fetch('http://localhost:5000/api/admin/accountInfo', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
            });
            const accountInfo = await response.json();
            // account Info is an object of { firstName, lastName, email }
            return accountInfo;
        }
        catch (error) {
            console.error("error encountered in getting the account info" + error);
        }
    }

    async function validateOldPassword() {
        console.log(oldPassword);
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/check_password",
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ oldPassword: oldPassword })
                }
            );
            if (response.ok) {
                return await response.json(); // should return true or false
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

    async function SaveAccountData(dataToSave) {
        try {
            console.log(fieldInfo);

            const response = await fetch(
                'http://localhost:5000/api/admin/update',
                {
                    method: "PUT",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(dataToSave)
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

    //#endregion =================================================================================================

    //#region PASSWORD FUNCTIONS ========================================================================================

    // button that activates the password field
    function PasswordButton() {
        function handleClick() {
            // clear previous entry in oldpassword
            setOldPassword('');
            // toggle on
            setIsPasswordActive(true);
        }
        return (
            <button className="button4"
                style={{ display: `${isPasswordActive ? "none" : "inline"}` }}
                onClick={handleClick}>
                CHANGE PASSWORD
            </button>
        );
    }

    // handle pressing "enter" on the old password input
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            validateOldPassword().then((isSuccess) => {
                if (isSuccess) {
                    setOldPasswordValid(true);
                }
                else {
                    alert("Password is not valid");
                    setOldPasswordValid(false);
                }
            })
        }
    }

    function handleSubmitOldPassword() {
        validateOldPassword().then((isSuccess) => {
            if (isSuccess) {
                // clear old password
                setFieldInfo({
                    ...fieldInfo,
                    password: ''
                });
                // activate the input field for the new password
                setOldPasswordValid(true);
            }
            else {
                alert("Password is not valid");
                setOldPasswordValid(false);
            }
        })
    }
    function handleSubmitNewPassword() {
        if (passwordRef.current.validity.valid) {
            SaveAccountData({ password: fieldInfo.password });
            setConfirmationMessageStatus('success');
            setIsPasswordActive(false);
            setOldPasswordValid(false);
        }
        else {
            setConfirmationMessageStatus('fail'); // display error message
        }
    }

    // validate if the password meets requirements
    function ValidatePassword() {
        // validate letters
        var lowerCaseLetters = /[a-z]/g;
        if (fieldInfo.password.match(lowerCaseLetters)) {
            lowercaseRef.current.className = "valid";
        } else {
            lowercaseRef.current.className = "invalid";
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (fieldInfo.password.match(upperCaseLetters)) {
            capitalRef.current.className = "valid";
        } else {
            capitalRef.current.className = "invalid";
        }

        // validate numbers
        var numbers = /[0-9]/g;
        if (fieldInfo.password.match(numbers)) {
            numberRef.current.className = "valid";
        } else {
            numberRef.current.className = "invalid";
        }

        // Validate length
        if (fieldInfo.password.length >= 8) {
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

    function ShowPasswordBox() {
        // if the password is hidden or shows as text
        function ToggleShowPassword() {
            console.log("toggle clicked");
            if (passwordRef.current.type === "password") {
                passwordRef.current.type = "text";
            } else {
                passwordRef.current.type = "password";
            }
        }

        if (isPasswordActive) {
            if (oldPasswordValid) {
                return (
                    <div>
                        <h3>Enter a New Password:</h3>
                        <input type="password"
                            placeholder="New Password"
                            value={fieldInfo.password}
                            name="new-password"
                            ref={passwordRef}
                            onChange={handlePasswordChange}
                            onFocus={() => setShowPasswordMessage(true)}
                            onBlur={() => setShowPasswordMessage(false)}
                            onKeyUp={ValidatePassword}
                            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        />
                        <br />
                        <PasswordMessage />
                        <button className="button4"
                            style={{ display: `${passwordValidity ? "inline" : "none"}` }}
                            onClick={handleSubmitNewPassword}
                        >Submit</button>
                        <br />
                        <input type="checkbox" onClick={ToggleShowPassword} /> Show Password
                    </div>
                );
            }
            else {
                return (
                    <div>
                        <h3>Please enter your current password to validate identity:</h3>
                        <input type="password"
                            placeholder="Current Password"
                            name="current-password"
                            value={oldPassword}
                            onChange={handleOldPasswordChange}
                            ref={oldPasswordRef}
                            onKeyPress={handleKeyPress}
                        />
                        <br />
                        <button className="button4" onClick={handleSubmitOldPassword}>Submit</button>
                    </div>
                );
            }
        }
    }

    //#endregion =================================================================================================

    //#region UPDATE ACCOUNT INFO =======================================================================================

    // handle submission of form
    function handleSubmit(e) {
        e.preventDefault();
        console.log("clicked on form submit");

        // save account data if we have it
        let saveResults = [];
        if (isFirstNameActive) {
            saveResults.push(SaveAccountData({ firstName: fieldInfo.firstName }));
        }
        if (isLastNameActive) {
            saveResults.push(SaveAccountData({ lastName: fieldInfo.lastName }));
        }

        Promise.all(saveResults).then(results => {
            console.log("save results = ", results);
            setConfirmationMessageStatus('success');
        })
            .catch(err => {
                console.error(err);
                setConfirmationMessageStatus('fail');
            });

        // clear the form
        setFieldInfo({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        });

        // deactivate fields
        setIsFirstNameActive(false);
        setIsLastNameActive(false);
        setIsPasswordActive(false);

    }

    // handle cancel button
    function handleCancel(e) {
        e.preventDefault();
        setFieldInfo({
            firstName: "",
            lastName: "",
            email: "",
            password: "",
        });
        setIsFirstNameActive(false);
        setIsLastNameActive(false);
        setIsPasswordActive(false);
    }

    //#endregion =================================================================================================

    //#region CHECK USER AUTHENTICATION ==================================================================================

    useEffect(() => {
        // if we have verified the user authentication state...
        if (isAuthenticated !== "fetching") {
            // if not authenticated, navigate back to login page
            if (!isAuthenticated) {
                setIsLoggedIn(false);
                navigate('/admin-login');
            }
        }
        else {
            AuthenticateUser().then((result) => {
                if (result) {
                    setIsAuthenticated(true);
                }
                else {
                    setIsAuthenticated(false);
                }
            })
        }
    }, [isAuthenticated]);

    // if we haven't already gotten the data, get the data from the backend
    useEffect(() => {
        if (needsAccountData) {
            getAccountData().then((accountData) => {
                if (accountData) {
                    setFieldInfo({
                        firstName: accountData.firstName,
                        lastName: accountData.lastName,
                        email: accountData.email,
                        password: "",
                    });
                    setNeedsAccountData(false);
                }
            });
        }
    }, [needsAccountData]);

    // when the email field changes
    function handleEmailChange(e) {
        console.log("email field cannot be edited");
        return;
    }

    //#endregion =================================================================================================

    const navigate = useNavigate();
    // if we haven't yet checked the token, display a blank page (or a loading indicator)
    if (isAuthenticated === "fetching") {
        return (
            <div />
        )
    }
    else {
        // otherwise display the profile page
        return (
            <div className="fullBox">
                <div style={{width: "30%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h2>My Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <label>
                            First Name:
                            <input
                                type="text"
                                placeholder="First Name"
                                value={fieldInfo.firstName}
                                onChange={handleFirstNameChange}
                                onFocus={() => setIsFirstNameActive(true)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Last Name:
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={fieldInfo.lastName}
                                onChange={handleLastNameChange}
                                onFocus={() => setIsLastNameActive(true)}
                                required
                            />
                        </label>
                        <br />
                        <label>
                            Email:
                            <input
                                type="email"
                                placeholder="Email"
                                value={fieldInfo.email}
                                onChange={handleEmailChange}
                                readOnly
                            />
                        </label>
                        <br />
                        <PasswordButton />
                        <ShowPasswordBox />
                        <button className="button4" type="submit">
                            Save Changes
                        </button>
                        <button className="button4" onClick={handleCancel}>
                            Cancel
                        </button>
                    </form>
                    {confirmationMessageStatus === 'success' && (
                        <div className="success-message">Changes saved successfully!</div>
                    )}
                    {confirmationMessageStatus === 'fail' && (
                        <div className="error-message">Failed to save changes. Please try again.</div>
                    )}
                </div>
            </div>
        );
    }
}