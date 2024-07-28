import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export default function ScooterPage() {

    const [isScooterLoaded, setIsScooterLoaded] = useState(false);
    const [scooters, setScooters] = useState(null);

    // get scooter info from backend (from DB)
    async function getScooters() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/scooters",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
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

    // button that switches to the createaccount page
    function MoreInfoButton({scooterId}) {
        const navigate = useNavigate();
        function handleClick() {
            navigate(`/scooters/${scooterId}`, {})
        }
        return (
            <button className="button1" onClick={handleClick}>
                MORE INFO
            </button>
        );
    }

    if (!isScooterLoaded) {
        // get scooter info function
        (async function(){
            console.log("getting scooter info...");
            const result = await getScooters();
            setIsScooterLoaded(true);
            if (!result) {
                console.log("result is null")
                setIsScooterLoaded(false);
            }
            else {
                console.log("setting scooter info...");
                setScooters(result.scooters);
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

    else {
        return(
            <div className="fullBox">
                <div style={{width: "70%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                    <h1>Our Scooters</h1>
                    <ul className="scooterList">
                        {scooters.map((scooter, index) => (
                        <li className="scooterListItems" key={index}>
                            <h2>{scooter.model}</h2>
                            <h3>ID: {scooter.id}</h3>
                            <p>Current location: {scooter.latitude}, {scooter.longitude}</p>
                            <p>Battery charge: {scooter.battery}</p>
                            <p>Availability: { scooter.availability ? "available now" : scooter.waitTimeMinutes }</p>
                            <p>Rental price: {scooter.rentalPrice}</p>
                            <MoreInfoButton scooterId={scooter.id}/>
                        </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    
}