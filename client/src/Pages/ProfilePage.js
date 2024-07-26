import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate} from 'react-router-dom';

import { ReactComponent as PencilIcon} from '../assets/pencilIcon.svg';
import { IsLoggedInContext } from '../App.js';


export default function ProfilePage() {

    //#region STATES, CONTEXT, REFS =====================================================================================

    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    // states
    const [isAuthenticated, setIsAuthenticated] = useState('fetching');
    const [needsAccountData, setNeedsAccountData] = useState(true);

    const [isFirstNameActive, setIsFirstNameActive] = useState(false);
    const [isLastNameActive, setIsLastNameActive] = useState(false);
    const [isEmailActive, setIsEmailActive] = useState(false);
    const [isPasswordActive, setIsPasswordActive] = useState(false);
    const [isAddressActive, setIsAddressActive] = useState(false);
    const [isCardActive, setIsCardActive] = useState(false);

    const [showPasswordMessage, setShowPasswordMessage] = useState(false);
    const [passwordValidity, setPasswordValidity] = useState(false);

    const [oldPassword, setOldPassword] = useState('');
    function handleOldPasswordChange(e) {
        setOldPassword(e.target.value);
    }

    const [oldPasswordValid, setOldPasswordValid] = useState(false);

    const [hasCreditCard, setHasCreditCard] = useState(false);
    function handleOldPasswordChange(e) {
        setOldPassword(e.target.value);
    }

    const [isConfirmationBoxOpen, setIsConfirmationBoxOpen] = useState(false);

    const [confirmationMessageStatus, setConfirmationMessageStatus] = useState('closed');


    // Profile state variables for name (only use for creating new account)
    const [fieldInfo, setFieldInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        creditCardNumber: '',
        creditCardExpirationDate: '',
	    creditCardCVV: '',
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
    function handleEmailChange(e) {
        setFieldInfo({
            ...fieldInfo,
            email: e.target.value
        });
    }
    function handlePasswordChange(e) {
        setFieldInfo({
            ...fieldInfo,
            password: e.target.value
        });
    }
    function handleAddressChange(e) {
        setFieldInfo({
            ...fieldInfo,
            address: e.target.value
        });
    }
    function handleCardNumChange(e) {
        setFieldInfo({
            ...fieldInfo,
            creditCardNumber: e.target.value
        });
    }
    function handleCardDateChange(e) {
        setFieldInfo({
            ...fieldInfo,
            creditCardExpirationDate: e.target.value
        });
    }
    function handleCardCVVChange(e) {
        setFieldInfo({
            ...fieldInfo,
            creditCardCVV: e.target.value
        });
    }

    // get references to the HTML elements
    const lowercaseRef = useRef(null);
    const capitalRef = useRef(null);
    const numberRef = useRef(null);
    const lengthRef = useRef(null);

    const firstNameRef = useRef(null);
    const lastNameRef = useRef(null);
    const emailRef = useRef(null);
    const oldPasswordRef = useRef(null);
    const passwordRef = useRef(null);
    const addressRef = useRef(null);
    const cardNumRef = useRef(null);
    const cardDateRef = useRef(null);
    const cardCVVRef = useRef(null);

    //#endregion =================================================================================================

    //#region BACKEND ASYNC FUNCTIONS ===================================================================================
    async function AuthenticateUser() {
        // if the token doesn't exist...
        if (localStorage.getItem("token") == null) {
            return false;
        }
        try {    
            console.log("in the fetch request");
            const response = await fetch('http://localhost:5000/api/token/verify', {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`
            },
        });
        const {message} = await response.json(); // this will return true or false in "status"
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

    // get account information from backend
    async function validateOldPassword() {
        console.log(oldPassword);
        try {
            const response = await fetch(
                "http://localhost:5000/api/users/check_password",
                {
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({oldPassword: oldPassword})
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
                'http://localhost:5000/api/users/update',
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
            style={{display: `${isPasswordActive ? "none" : "inline"}`}}
            onClick={handleClick}>
                CHANGE PASSWORD
            </button>
        );
    }

    // handle pressing "enter" on the old password input
    function handleKeyPress (event) {
        if(event.key === 'Enter'){
          validateOldPassword().then((isSuccess) => {
            if (isSuccess){
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
            if (isSuccess){
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
        if(passwordRef.current.validity.valid){
            SaveAccountData({password: fieldInfo.password});
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
        if(fieldInfo.password.match(lowerCaseLetters)) {
            lowercaseRef.current.className = "valid";
        } else {
            lowercaseRef.current.className = "invalid";
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if(fieldInfo.password.match(upperCaseLetters)) {
            capitalRef.current.className = "valid";
        } else {
            capitalRef.current.className = "invalid";
        }

        // validate numbers
        var numbers = /[0-9]/g;
        if(fieldInfo.password.match(numbers)) {
            numberRef.current.className = "valid";
        } else {
            numberRef.current.className = "invalid";
        }

        // Validate length
        if(fieldInfo.password.length >= 8) {
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
        if (oldPasswordValid) {
            return (
                <div>
                    <input type="checkbox"
                        onClick={ToggleShowPassword}
                    />
                    Show Password
                </div>
            );
        }
        else {
            return (
                <div />
            );
        }
    }

    //#endregion =================================================================================================

    //#region CREDIT CARD FUNCTIONS ======================================================================================

    function CreditCardButton() {
        function handleClick() {
            // clear the credit card fields
            setFieldInfo({
                ...fieldInfo,
                creditCardNumber: ''
            });
            setFieldInfo({
                ...fieldInfo,
                creditCardExpirationDate: ''
            });
            setFieldInfo({
                ...fieldInfo,
                creditCardCVV: ''
            });

            setHasCreditCard(false);
        }

        if (hasCreditCard) {
            return (
                <div>
                    <p style={{display: `${isCardActive ? "none" : "inline"}`}}>
                        {fieldInfo.creditCardNumber}
                    </p> <br/>
                    <button className="button4"
                    style={{display: `${isCardActive ? "none" : "inline"}`}}
                    onClick={handleClick}>
                        DELETE CARD
                    </button>
                </div>
            );
        }
        else {
            return (
                <button className="button4"
                style={{display: `${isCardActive ? "none" : "inline"}`}}
                onClick={() => setIsCardActive(true)}>
                    ADD CREDIT CARD
                </button>
            );
        }
        
    }

    function handleSubmitCreditCard() {
        if (cardNumRef.current.validity.valid &&
            cardDateRef.current.validity.valid &&
            cardCVVRef.current.validity.valid
        ) {
            SaveAccountData({
                creditCardNumber: fieldInfo.creditCardNumber,
                creditCardExpirationDate: fieldInfo.creditCardExpirationDate,
                creditCardCVV: fieldInfo.creditCardCVV
            })
            setConfirmationMessageStatus('success');
            setIsCardActive(false);
            setHasCreditCard(true);
        }
        else {
            setConfirmationMessageStatus('fail');
        }
    }

//#endregion  ========================================================================================

    //#region DELETE ACCOUNT FUNCTIONS ========================================================================================

    // button that saves the changed account info
    function DeleteAccountButton() {
        return (
            <button className="button3" onClick={() => setIsConfirmationBoxOpen(true)}>
                DELETE ACCOUNT
            </button>
        );
    }

    function DeleteConformationBox() {
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
        if (isConfirmationBoxOpen) {
            return (
                <div className="deleteConfirmationBox">
                    <p>
                        &#9888; Are you sure you want to delete your account? <br/>
                        This is non-reversible.
                    </p>
                    <button className="button4" onClick={handleClick}>
                        DELETE
                    </button> <br/>
                    <button className="button4" onClick={() => setIsConfirmationBoxOpen(false)}>
                        CANCEL
                    </button>
                </div>
            )
        }
        else {
            return (
                <div/>
            );
        }
        
    }

    //#endregion  ==========================================================================================


    // function to handle all the (pencil) edit buttons
    function EditButton({buttonCase}) {
        // case for firstName
        if (buttonCase === 0) {
            return (
                <button className="button4"
                    onClick={() => {
                        if(isFirstNameActive && firstNameRef.current.validity.valid){
                            SaveAccountData({firstName: fieldInfo.firstName});
                            setConfirmationMessageStatus('success');
                        }
                        else if (isFirstNameActive) { 
                            setConfirmationMessageStatus('fail'); // display error message
                            setNeedsAccountData(true); // reload the fields
                        }
                        setIsFirstNameActive((props) => !props)
                    }}>
                    <PencilIcon style={{ height: "30px", fill: "black" }} />
                </button>
            );
        }
        else if (buttonCase === 1) {
            return (
                <button className="button4"
                    onClick={() => {
                        if(isLastNameActive && lastNameRef.current.validity.valid){
                            SaveAccountData({lastName: fieldInfo.lastName});
                            setConfirmationMessageStatus('success');
                        }
                        else if (isLastNameActive) { 
                            setConfirmationMessageStatus('fail'); // display error message
                            setNeedsAccountData(true); // reload the fields
                        }
                        setIsLastNameActive((props) => !props)
                    }}>
                    <PencilIcon style={{ height: "30px", fill: "black" }} />
                </button>
            );
        }
        else if (buttonCase === 2) {
            return (
                <button className="button4"
                    onClick={() => {
                        if(isEmailActive && emailRef.current.validity.valid){
                            SaveAccountData({email: fieldInfo.email});
                            setConfirmationMessageStatus('success');
                        }
                        else if (isEmailActive) { 
                            setConfirmationMessageStatus('fail'); // display error message
                            setNeedsAccountData(true); // reload the fields
                        }
                        setIsEmailActive((props) => !props)
                    }}>
                    <PencilIcon style={{ height: "30px", fill: "black" }} />
                </button>
            );
        }
        else {
            return (
                <button className="button4"
                    onClick={() => {
                        if(isAddressActive && addressRef.current.validity.valid){
                            SaveAccountData({address: fieldInfo.address});
                            setConfirmationMessageStatus('success');
                        }
                        else if (isAddressActive) { 
                            setConfirmationMessageStatus('fail'); // display error message
                            setNeedsAccountData(true); // reload the fields
                        }
                        setIsAddressActive((props) => !props)
                    }}>
                    <PencilIcon style={{ height: "30px", fill: "black" }} />
                </button>
            );
        }
    }

    // shows the invalid message only if the showPasswordMessage state is true
    function ConfirmationMessage() {
        if (confirmationMessageStatus === 'success') {
            return (
                <p className="successText">
                    &#x2713; Changes saved.
                </p>
            );
        }
        else if (confirmationMessageStatus === 'fail') {
            return (
                <p className="warningText">
                    &#9888; Sorry, there was an issue saving your changes.
                </p>
            );
        }

        else {
            return (
                <div />
            );
        }
    }
    

    if (isAuthenticated === 'fetching') {
        // call authentification function
        (async function(){
            const result = await AuthenticateUser();
            if (result) {
                setIsLoggedIn(true);
                setIsAuthenticated('true');
            }
            else {setIsAuthenticated('false');}
        })();

        return (
            <div>
                One moment...
            </div>
        );
    }
    else if (isAuthenticated === 'true') {

        if (needsAccountData) {
            console.log("GETTING ACCOUNT DATA");
            // call authentification function
            (async function(){
                const data = await getAccountData();
                console.log("the fetched data: ");
                console.log(data);

                setFieldInfo(data);

                // if the credit card number exists, set hasCard
                if (fieldInfo.creditCardNumber !== '') {
                    setHasCreditCard(true);
                }

                setNeedsAccountData(false);
            })();
        }

        return (
            <div className="fullBox gray">
                <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>My Profile</h1>
                    <ConfirmationMessage />
                    <p>First Name:</p>
                    <input className="input2" disabled={ isFirstNameActive ? false : true } required
                        type="text"
                        placeholder="First Name"
                        ref={firstNameRef}
                        value={fieldInfo.firstName}
                        onChange={handleFirstNameChange}
                    />
                    <EditButton buttonCase={0} />

                    <p>Last Name:</p>
                    <input className="input2" disabled={ isLastNameActive ? false : true } required
                        type="text"
                        placeholder="Last Name"
                        ref={lastNameRef}
                        value={fieldInfo.lastName}
                        onChange={handleLastNameChange}
                    />
                    <EditButton buttonCase={1} />

                    <p>Email:</p>
                    <input className="input2" disabled={ isEmailActive ? false : true } required
                        type="email"
                        placeholder="Email"
                        ref={emailRef}
                        value={fieldInfo.email}
                        onChange={handleEmailChange}
                    />
                    <EditButton buttonCase={2} />

                    <p>Password:</p>
                    <PasswordButton />
                    <p style={{display: `${isPasswordActive && !oldPasswordValid ? "inline" : "none"}`}}> <br/>Please enter your <i>current</i> password:</p>
                    <input className="input2" style={{display: `${isPasswordActive && !oldPasswordValid ? "inline" : "none"}`}} required
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        placeholder="Current Password"
                        ref={oldPasswordRef}
                        value={oldPassword}
                        onChange={handleOldPasswordChange}
                    />
                    <button className="button4" style={{display: `${isPasswordActive && !oldPasswordValid ? "inline" : "none"}`}}
                    onClick={handleSubmitOldPassword}>
                        SUBMIT
                    </button>
                    <button className="button4" style={{display: `${isPasswordActive && !oldPasswordValid ? "inline" : "none"}`}}
                    onClick={() => setIsPasswordActive(false)}>
                        CANCEL
                    </button>

                    <p style={{display: `${oldPasswordValid ? "inline" : "none"}`}}> <br/>Please enter your <i>new</i> password:</p>
                    <input className="input2" style={{display: `${oldPasswordValid ? "inline" : "none"}`}} required
                        type="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        placeholder="Password"
                        ref={passwordRef}
                        value={fieldInfo.password}
                        onChange={handlePasswordChange}
                        onFocus={() => {setShowPasswordMessage(true)}}
                        onBlur={() => {
                            if(passwordValidity) {setShowPasswordMessage(false)}
                        }}
                        onKeyUp={ValidatePassword}
                    />
                    <br/>
                    <ShowPasswordBox/>
                    <PasswordMessage/>
                    <button className="button4" style={{display: `${oldPasswordValid ? "inline" : "none"}`}}
                    onClick={handleSubmitNewPassword}>
                        SUBMIT
                    </button>
                    <button className="button4" style={{display: `${oldPasswordValid ? "inline" : "none"}`}}
                    onClick={() => setIsPasswordActive(false)}>
                        CANCEL
                    </button>

                    <p>Address:</p>
                    <input className="input2" disabled={ isAddressActive ? false : true }
                        type="text"
                        placeholder="Address"
                        ref={addressRef}
                        value={fieldInfo.address}
                        onChange={handleAddressChange}
                    />
                    <EditButton buttonCase={3} />

                    <p>Payment:</p>
                    <CreditCardButton />

                    <p style={{display: `${isCardActive ? "inline" : "none"}`}}> <br/>Credit card number:</p>
                    <input className="input2" style={{display: `${isCardActive ? "inline" : "none"}`}} required
                        type="tel"
                        pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        ref={cardNumRef}
                        value={fieldInfo.creditCardNumber}
                        onChange={handleCardNumChange}
                    />
                    <p style={{display: `${isCardActive ? "inline" : "none"}`}}> <br/>Expiration date:</p>
                    <input className="input2" style={{display: `${isCardActive ? "inline" : "none"}`}} required
                        type="tel"
                        pattern="[0-9]{2}/[0-9]{2}"
                        placeholder="XX/XX"
                        ref={cardDateRef}
                        value={fieldInfo.creditCardExpirationDate}
                        onChange={handleCardDateChange}
                    />
                    <p style={{display: `${isCardActive ? "inline" : "none"}`}}> <br/>CVC code:</p>
                    <input className="input2" style={{display: `${isCardActive ? "inline" : "none"}`}} required
                        type="text"
                        pattern="[0-9]{3}"
                        placeholder="XXX"
                        ref={cardCVVRef}
                        value={fieldInfo.creditCardCVV}
                        onChange={handleCardCVVChange}
                    />
                    <button className="button4" style={{display: `${isCardActive ? "inline" : "none"}`}}
                    onClick={handleSubmitCreditCard}>
                        SUBMIT
                    </button>
                    <button className="button4" style={{display: `${isCardActive ? "inline" : "none"}`}}
                    onClick={() => {setIsCardActive(false)}}>
                        CANCEL
                    </button> <br/>

                    <br/>
                    <DeleteConformationBox />
                    <DeleteAccountButton />
                </div>
            </div>
        );
    }
    else {
        setIsLoggedIn(false);
        return (
            <Navigate to='/login' />
        );
    }
}