import React, { useState, useEffect } from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';

export default function ScooterPage() {
    // this is the scooter id from the url
    const {id} = useParams();

    const [isScooterLoaded, setIsScooterLoaded] = useState('false');
    const [scooterInfo, setScooterInfo] = useState({
        id: null,
        model: '',
        latitude: null,
        longitude: null,
        battery: null,
        availability: false,
        rentalPrice: null,
        waitTimeMinutes: null
    });

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
                console.log("response is ok");
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
    
    if (isScooterLoaded === 'false') {
        // get scooter info function
        (async function(){
            console.log("getting scooter info...");
            const result = await getScooters();
            setIsScooterLoaded('true');
            if (!result) {
                console.log("result is null")
                // go back to scooter page - this scooter doesn't exist
                setIsScooterLoaded('error');
            }
            else {
                console.log("setting scooter info...");
                setScooterInfo(result);
            }
        })();
    
        return (
            <div className="fullBox">
                <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>One Moment</h1>
                    <h2>Loading scooter information...</h2>
                </div>
            </div>
        );
    }
    else if (isScooterLoaded === 'true') {
        return (
            <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>{scooterInfo.model}</h1>
                <h2>Scooter information:</h2>
                <ul>
                    <li><strong>Model</strong>: {scooterInfo.model}</li>
                    <li><strong>Starting location</strong>: {scooterInfo.latitude}, {scooterInfo.longitude}</li>
                    <li><strong>Battery charge</strong>: {scooterInfo.battery}%</li>
                    <li><strong>Rental price</strong>: ${scooterInfo.rentalPrice}</li>
                    <li><strong>Availability</strong>: { scooterInfo.availability ? "availabile to rent now" : scooterInfo.waitTimeMinutes + " minutes wait" }</li>
                </ul>

                <NavLink className="button1" to={`/rent/${scooterInfo.id}`}>RENT</NavLink>
            </div>
        </div>
        );
    }
    else {
        return (
            <Navigate to='/scooters' />
        );
    }
}