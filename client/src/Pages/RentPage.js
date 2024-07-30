import React, { useState, useContext } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App.js';

export default function RentPage() {
    // this is the scooter id from the url
    const { id } = useParams();

    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    const [isAuthenticated, setIsAuthenticated] = useState('fetching');

    const [isScooterLoaded, setIsScooterLoaded] = useState('false');

    const [scooterInfo, setScooterInfo] = useState({
        id: null,
        model: '',
        latitude: null,
        longitude: null,
        battery: null,
        availability: false,
        rentalPrice: null
    });

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
    else if (isAuthenticated === 'true' && isScooterLoaded === 'true'){
        return (
            <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Rent {scooterInfo.model}</h1>
                <h2>Scooter information:</h2>
                <ul>
                    <li>Model: {scooterInfo.model}</li>
                    <li>Starting location: {scooterInfo.latitude}, {scooterInfo.longitude}</li>
                    <li>Battery charge: {scooterInfo.battery}</li>
                    <li>Rental price: {scooterInfo.rentalPrice}</li>
                    <li>time specified</li>
                    <li>ACTIVE countdown</li>
                    <li>time the rental is due</li>
                </ul>
                <h2>Rental details:</h2>
                <p>Rent time:</p>
                <p>Put an input field here</p>
                <p>Payment method:</p>
                <p>TODO: load the account info and get credit card, else have na input field</p>
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