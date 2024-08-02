import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate} from 'react-router-dom';

import { IsLoggedInContext } from '../App.js';


export default function RentalHistoryPage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    const [isAuthenticated, setIsAuthenticated] = useState('fetching');

    const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
    const [history, setHistory] = useState(null);


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
                "http://localhost:5000/api/FIXMEEEEEEEEEEEEEEEEEEEE",
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
            setIsHistoryLoaded('true');
            if (!result) {
                setIsHistoryLoaded('error')
            }
            else {
                setHistory(result);
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
                            <p><strong>Rental price</strong>: ${rental.scooter.rentalPrice}</p>
                            <p><strong>Final Price</strong>: ${rental.finalPrice}</p>
                            <p><strong>Time started</strong>: ${rental.timeRented}</p>
                            <p><strong>Time ended</strong>: ${rental.timeEnded}</p>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    else if (isHistoryLoaded === 'error') {
        alert("Error loading current rentals.");
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