import React, { useState, useContext, useRef } from 'react';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App.js';

export default function RentPage() {
    // this is the scooter id from the url
    const { id } = useParams();

    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    const [isAuthenticated, setIsAuthenticated] = useState('fetching');
    const [isScooterLoaded, setIsScooterLoaded] = useState('false');
    const [needsAccountData, setNeedsAccountData] = useState(true);

    const [scooterInfo, setScooterInfo] = useState({
        id: null,
        model: '',
        latitude: null,
        longitude: null,
        battery: null,
        availability: false,
        rentalPrice: null
    });
    const [accountInfo, setAccountInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        creditCardNumber: '',
        creditCardExpirationDate: '',
	    creditCardCVV: '',
    });
    function handleCardNumChange(e) {
        setAccountInfo({
            ...accountInfo,
            creditCardNumber: e.target.value
        });
    }
    function handleCardDateChange(e) {
        setAccountInfo({
            ...accountInfo,
            creditCardExpirationDate: e.target.value
        });
    }
    function handleCardCVVChange(e) {
        setAccountInfo({
            ...accountInfo,
            creditCardCVV: e.target.value
        });
    }
    const cardNumRef = useRef(null);
    const cardDateRef = useRef(null);
    const cardCVVRef = useRef(null);

    const [currentTime, setCurrentTime] = useState("00:00");
    const [timeDifference, setTimeDifference] = useState(0);
    function handleTimeChange(e) {
        e.preventDefault();
        console.log("the target value" + e.target.value);   // log the value of the input field

        // get the return time
        let hourDiff = parseInt(e.target.value.toString().substring(0,2)) - parseInt(currentTime.substring(0,2))
        let minDiff = parseInt(e.target.value.toString().substring(3,)) - parseInt(currentTime.substring(3,));
        if (hourDiff <= 0) {hourDiff = 0}
        if (minDiff <= 0) {minDiff = 0}
        
        setPrice(Math.round((scooterInfo.rentalPrice * (hourDiff + (minDiff / 60.00))) * 100) / 100);
        setTimeDifference((hourDiff * 60) + minDiff);
    }
    const [price, setPrice] = useState(0.00);

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

    // get scooter info from backend (from DB)
    async function getScooters() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/scooters/find",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({scooterId: id})
                }
            );
            if (response.ok) {
                return await response.json(); // scooter object
            }
            else {
                throw new Error('Network response was not ok');
            }
        }
        catch (error) {
            console.error("error detected: ", error);
            return null;
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

    //rent the scooter
    async function rent() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/users/rent_scooter",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({scooterId: scooterInfo._id, timeDifference: timeDifference})
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok, see console for details');
            }
            else {
                return true;
            }
        }
        catch (error) {
            console.error("error detected: ", error);
        }
    }   
    
    // gets the current time in hours and minutes, sets the state to a string for the input
    function clock() {         
        setTimeout(function() {   
            // set the currentTime
            let currentHours = new Date().getHours();
            let currentMinutes = new Date().getMinutes();
            if (currentHours.toString().length <= 1) {currentHours = "0" + currentHours}
            if (currentMinutes.toString().length <= 1) {currentMinutes = "0" + currentMinutes}
            setCurrentTime(currentHours + ":" + currentMinutes);  

            // set the price
            // const hourDiff = parseInt(returnTime.substring(0,2)) - parseInt(currentTime.substring(0,2))
            // const minDiff = parseInt(returnTime.substring(3,)) - parseInt(currentTime.substring(3,));
            // console.log("hourDiff " + hourDiff + ", minDiff: " + minDiff);
            // if (hourDiff <= 0 && minDiff <= 0) {
            //     setRentTime(0);
            // }
            // else {
            //     setRentTime(hourDiff + (minDiff / 60.00));
            // }
            // setPrice(scooterInfo.rentalPrice * rentTime);

            // keep calling the clock every second
            clock();         
        }, 1000)
    }

    function useCurrentTimeForMin() {
        if (Date().getHours() > 6) {
            return true;
        }
        else {
            return false;
        }
    }

    function RentButton() {
        const navigate = useNavigate();
        function handleClick() {
            rent().then((result) => {
                if (result) {
                    alert("success");
                    navigate("/current-rentals", {});
                }
                else {
                    alert("Sorry, unable to rent " + scooterInfo.model + " right now.")
                }
            });
        }
        return (
            <button className="button1" onClick={handleClick}
            disabled={price != 0 &&
                (accountInfo.creditCardNumber != '' || 
                cardNumRef.current.validity.valid && cardDateRef.current.validity.valid && cardCVVRef.current.validity.valid)
                ? false : true}
            >
                RENT
            </button>
        );
    }

    function CreditCardDisplay() {
        if (accountInfo.creditCardNumber === '') {
            return (
                <div>
                    <p>You have no saved card. Please enter one below for a one-time payment.</p>
                    <p>Credit card number:</p>
                    <input className="input2" required
                        type="tel"
                        pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                        placeholder="XXXX-XXXX-XXXX-XXXX"
                        ref={cardNumRef}
                        value={accountInfo.creditCardNumber}
                        onChange={handleCardNumChange}
                    />
                    <p>Expiration date:</p>
                    <input className="input2" required
                        type="tel"
                        pattern="[0-9]{2}/[0-9]{2}"
                        placeholder="XX/XX"
                        ref={cardDateRef}
                        value={accountInfo.creditCardExpirationDate}
                        onChange={handleCardDateChange}
                    />
                    <p>CVC code:</p>
                    <input className="input2" required
                        type="text"
                        pattern="[0-9]{3}"
                        placeholder="XXX"
                        ref={cardCVVRef}
                        value={accountInfo.creditCardCVV}
                        onChange={handleCardCVVChange}
                    />
                </div>
            );
        }
        else {
            return (
                <div>
                    <p>Use your saved card:</p>
                    <p><strong>{accountInfo.creditCardNumber}</strong></p>
                </div>
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
            <div className="fullBox">
                <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>One Moment</h1>
                    <h2>Getting account information...</h2>
                </div>
            </div>
        );

    }
    else if (isAuthenticated === 'true' && isScooterLoaded === 'false') {
        // get scooter info function
        (async function(){
            const result = await getScooters();
            setIsScooterLoaded('true');
            if (!result) {
                setIsScooterLoaded('error')
            }
            else {
                setScooterInfo(result);
                clock();
            }
        })();

        // get the account info
        (async function(){
            const data = await getAccountData();
            console.log("the fetched data: ");
            console.log(data);

            setAccountInfo(data);
        })();

        return (
            <div className="fullBox">
                <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>One Moment</h1>
                    <h2>Loading the scooter information...</h2>
                </div>
            </div>
        );
    }
    else if (isAuthenticated === 'true' && isScooterLoaded === 'true'){
        return (
            <div className="fullBox">
            <div style={{width: "70%", placeSelf: "center", display: "inline-block", lineHeight: "48px"}}>
                <div style={{textAlign: "center", width: "100%", marginBottom: "20px"}}><h1>Rent {scooterInfo.model}</h1></div>
                <div className="rentBox">
                    <h2>Scooter information:</h2>
                    <ul>
                        <li><strong>Model</strong>: {scooterInfo.model}</li>
                        <li><strong>Starting location</strong>: {scooterInfo.latitude}, {scooterInfo.longitude}</li>
                        <li><strong>Battery charge</strong>: {scooterInfo.battery}%</li>
                        <li><strong>Rental price</strong>: ${scooterInfo.rentalPrice} per hour</li>
                        <li><strong>Availability</strong>: { scooterInfo.availability ? "availabile to rent now" : scooterInfo.waitTimeMinutes + " minutes wait" }</li>
                    </ul>
                </div>
                <div className="rentBox outlined">
                    <h2>Rental details:</h2> <br/>
                    <p>Rent time:</p>
                    <div>
                        <input aria-label="Time" name="current time" type="time"
                            className="timeField currentTime" readOnly={true} value={currentTime} />
                        <div style={{display: "inline-block", marginLeft: "5px", marginRight: "5px"}}>to</div>
                        <input aria-label="Time" name="return time" type="time" required
                            min={useCurrentTimeForMin ? currentTime : "06:00"} max="18:00"
                            onChange={handleTimeChange}
                            className="timeField"/>
                    </div><br/>
                    
                    <p>{price == 0 ? '' : `Price: \$${price}`}</p> <br/>

                    <p>Payment method:</p>
                    <CreditCardDisplay />
                    <br/>
                    <RentButton />
                </div>
            </div>
        </div>
        );
    }
    else if (isScooterLoaded === 'error') {
        return (
            <Navigate to='/scooters' />
        );
    }
    else {
        setIsLoggedIn(false);
        return (
            <Navigate to='/login' />
        );
    }
}