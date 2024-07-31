import React, { useState, useContext, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
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

    const [currentTime, setCurrentTime] = useState("00:00");
    function handleTimeChange(e) {
        e.preventDefault();
        console.log("the target value" + e.target.value);   // log the value of the input field

        // get the return time
        let hourDiff = parseInt(e.target.value.toString().substring(0,2)) - parseInt(currentTime.substring(0,2))
        let minDiff = parseInt(e.target.value.toString().substring(3,)) - parseInt(currentTime.substring(3,));
        if (hourDiff <= 0) {hourDiff = 0}
        if (minDiff <= 0) {minDiff = 0}

        setPrice(scooterInfo.rentalPrice * (hourDiff + (minDiff / 60.00)));
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
        function handleClick() {
            alert("rent");
        }
        return (
            <button className="button1" onClick={handleClick}>RENT</button>
        );
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
                <div style={{height: "400px", width: "50%", display: "inline-block", verticalAlign: "top"}}>
                    <h2>Scooter information:</h2>
                    <ul>
                        <li><strong>Model</strong>: {scooterInfo.model}</li>
                        <li><strong>Starting location</strong>: {scooterInfo.latitude}, {scooterInfo.longitude}</li>
                        <li><strong>Battery charge</strong>: {scooterInfo.battery}%</li>
                        <li><strong>Rental price</strong>: ${scooterInfo.rentalPrice} per hour</li>
                        <li><strong>Availability</strong>: { scooterInfo.availability ? "availabile to rent now" : scooterInfo.waitTimeMinutes + " minutes wait" }</li>
                    </ul>
                </div>
                <div style={{height: "400px", width: "50%", display: "inline-block", verticalAlign: "top"}}>
                    <h2>Rental details:</h2>
                    <p>Rent time:</p>
                    <input aria-label="Time" name="current time" type="time"
                        className="timeField currentTime" readOnly={true} value={currentTime} />
                    <input aria-label="Time" name="return time" type="time" required
                        min={useCurrentTimeForMin ? currentTime : "06:00"} max="18:00"
                        onChange={handleTimeChange}
                        className="timeField"/>
                    
                    <p>Price:</p>
                    <p>{price}</p>

                    <p>Payment method:</p>
                    <p>{accountInfo.creditCardNumber === '' ? '' : accountInfo.creditCardNumber}</p>
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