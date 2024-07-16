import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate} from 'react-router-dom';

import { IsLoggedInContext } from '../App.js';


export default function CurrentRentalsPage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);
    
    // authentication
    if (isLoggedIn) {

        return (
            <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Current Rentals</h1>
                <h2>TODO:</h2>
                <p>
                    list current rentals here with information:
                </p>
                <ul>
                    <li>scooter model name</li>
                    <li>scooter starting location</li>
                    <li>scooter price rate</li>
                    <li>scooter battery charge</li>
                    <li>time specified</li>
                    <li>ACTIVE countdown</li>
                    <li>time the rental is due</li>
                </ul>
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