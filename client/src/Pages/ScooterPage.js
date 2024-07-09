import React from 'react';
import { useNavigate } from 'react-router-dom';


export default function ScooterPage() {
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

    return(
        <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Our Scooters</h1>
                <ul>
                    <li>
                        Mobility Scooter <br/>
                        have a picture and brief description <br/>
                        <MoreInfoButton scooterId={"mobility-scooter"}/>
                    </li>
                    <li>
                        Three-wheel Scooter <br/>
                        have a picture and brief description <br/>
                        <MoreInfoButton scooterId={"three-wheel-scooter"}/>
                    </li>
                </ul>
                

            </div>
        </div>
    );
}