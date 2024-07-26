import React, { useEffect, useState, useRef, useContext } from 'react';
import styles from '../styles.css';
import { Navigate, useNavigate} from 'react-router-dom';

import { IsLoggedInContext } from '../App.js';


export default function CurrentRentalsPage() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    const [isAuthenticated, setIsAuthenticated] = useState('fetching');

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
        setIsLoggedIn(false);
        return (
            <Navigate to='/login' />
        );
    }
}