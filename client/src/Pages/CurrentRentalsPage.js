import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate} from 'react-router-dom';

import { IsLoggedInContext } from '../App.js';


export default function CurrentRentalsPage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    const [isAuthenticated, setIsAuthenticated] = useState('fetching');

    const [isHistoryLoaded, setIsHistoryLoaded] = useState('false');
    const [history, setHistory] = useState(null);

    const [currentTime, setCurrentTime] = useState(new Date());
    const [countdownTime, setCountdownTime] = useState(null);


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
    async function getHistory() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/users/get_ongoing_rentals",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("response is ok");
            return await response.json(); // scooter object
        }
        catch (error) {
            console.error("error detected: ", error);
            return null;
        }
    }

    //rent the scooter
    async function returnScooter({scooter}) {
        try {
            // generate random coordinates (NOTE: in an actual app we would access the GPS coordinates)
            // generate random by randomly adding or subtracting a random hundredth number to the current coordinate
            const newLatitude = ((Math.random() < 0.5 ? -1 : 1) * (Math.random() / 100)) + scooter.latitude;
            const newLongitude = ((Math.random() < 0.5 ? -1 : 1) * (Math.random() / 100)) + scooter.longitude;

            console.log(scooter);
            const response = await fetch(
                "http://localhost:5000/api/users/end_rental",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({scooterId: scooter._id, latitude: newLatitude, longitude: newLongitude})
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
            setCurrentTime(new Date());  

            // keep calling the clock every second
            clock();         
        }, 1000)
    }

    function CountdownTimer({scooter, startTime, timeToRent}) {
        // add timeToRent (in miliseconds) to the start time to get the endRentTime, NOTE timeToRent is in minutes
        // then subtract the current time from that endRentTime
        const endRentTime = startTime + (timeToRent * 60 * 1000);
        const countdownTime = endRentTime - currentTime.getTime();
        const countdownTimeHours = Math.trunc(countdownTime / (60 * 60 * 1000));
        const countdownTimeMinutes = Math.trunc((countdownTime / (60 * 1000)) - (countdownTimeHours * 60));
        const countdownTimeSeconds = Math.trunc((countdownTime / (1000)) - (countdownTimeHours * 60 * 60) - (countdownTimeMinutes * 60));

        if (countdownTime <= 0) {
            // if countdown reaches zero, send alert and return the scooter
            alert("Rental time for " + scooter.model + " has ended. It will be automatically returned now.")
            returnScooter({scooter}).then((result) => {
                if (result) {
                    console.log("successfully returned")
                }
                else {
                    alert("Sorry, unable to return " + scooter.model + " right now.")
                }
            });
        }


        return(
            <p><strong>Time remaining in rental</strong>: {countdownTimeHours}:
                {countdownTimeMinutes.toString().padStart(2,"0")}:
                {countdownTimeSeconds.toString().padStart(2,"0")}
            </p>
        );
    }

    function ReturnButton({scooter}) {
        function handleClick() {
            console.log(scooter);
            returnScooter({scooter}).then((result) => {
                if (result) {
                    console.log(result);
                    setIsHistoryLoaded('false');    // reload the scooters now
                }
                else {
                    alert("Sorry, unable to return " + scooter.model + " right now.")
                }
            });
        }
        return (
            <button className="button1" onClick={handleClick}>
                RETURN EARLY
            </button>
        );
    }

    function RentNowButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/scooters", {})
        }
        return (
            <button className="button1" onClick={handleClick}>
                RENT ONE NOW
            </button>
        );
    }
    

    if (isAuthenticated === 'fetching') {
        // call authentification function
        (async function(){
            const result = await AuthenticateUser();
            if (result) {
                setIsLoggedIn(true);
                setIsAuthenticated('true');
                clock();    //start clock
            }
            else {setIsAuthenticated('false');}
        })();

        return (
            <div className="fullBox">
                <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>One Moment</h1>
                    <h2>Loading your account...</h2>
                </div>
            </div>
        );
    }
    else if (isAuthenticated === 'true' && isHistoryLoaded === 'false') {

        // get history info function
        (async function(){
            const result = await getHistory();
            if (!result) {
                setIsHistoryLoaded('error')
            }
            else {
                console.log(result);
                setHistory(result);
                setIsHistoryLoaded('true');
            }
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
    else if (isAuthenticated === 'true' && isHistoryLoaded === 'true'){
        // if there are no scooters in the history object, display this message
        if (history.length <= 0) {
            return(
                <div className="fullBox">
                    <div style={{width: "70%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                        <h1>Current Rentals</h1>
                        <h2>No current rentals!</h2>
                        <RentNowButton />
                    </div>
                </div>
            );
        }
        else {
            return(
                <div className="fullBox">
                    <div style={{width: "70%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                        <h1>Current Rentals</h1>
                        <ul className="scooterList">
                            {history.map((rental, index) => (
                            <li className="scooterListItems" key={index}>
                                <h2>{rental.scooter.model}</h2>
                                <h3><strong>ID</strong>: {rental.scooter.id}</h3>
                                <p><strong>Model</strong>: {rental.scooter.model}</p>
                                <p><strong>Starting location</strong>: {rental.startLatitude}, {rental.startLongitude}</p>
                                <p><strong>Battery charge</strong>: {rental.scooter.battery}%</p>
                                <p><strong>Rental rate</strong>: ${Math.trunc(rental.scooter.rentalPrice)}.
                                    {(Math.round((rental.scooter.rentalPrice - Math.trunc(rental.scooter.rentalPrice)) * 100)).toString().padStart(2,"0")} per hour</p>
                                <p><strong>Time started</strong>:&nbsp;
                                    {new Date(rental.rental_start).getMonth() + 1}/
                                    {new Date(rental.rental_start).getDate()}/
                                    {new Date(rental.rental_start).getFullYear()}&ensp;
                                    {new Date(rental.rental_start).getHours() < 12 ? 
                                        new Date(rental.rental_start).getHours() + ":"
                                            + new Date(rental.rental_start).getMinutes().toString().padStart(2, "0") + " AM"
                                        : new Date(rental.rental_start).getHours() - 12 + ":"
                                            + new Date(rental.rental_start).getMinutes().toString().padStart(2, "0") + " PM"
                                    }
                                </p>
                                <CountdownTimer scooter={rental.scooter} startTime={new Date(rental.rental_start).getTime()} timeToRent={rental.scooter.waitTimeMinutes}/>
                                <ReturnButton scooter={rental.scooter} />
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            );
        }
    }
    else if (isHistoryLoaded === 'error') {
        alert("Error loading current rentals.");
        return (
            <Navigate to='/profile' />
        );
    }
    else if (isAuthenticated === 'false') {
        alert("Error Authneticating.");
        return (
            <Navigate to='/profile' />
        );
    }
    else {
        setIsLoggedIn(false);
        return (
            <Navigate to='/login' />
        );
    }
}