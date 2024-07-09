import React, { useEffect, useState } from 'react';
import styles from './styles.css';
import { NavLink, useNavigate} from 'react-router-dom';

import HomePage from "./Pages/HomePage.js";
import LoginPage from "./Pages/LoginPage.js";
import ScooterPage from './Pages/ScooterPage.js';


export default function NavBar() {
    // The display case for the screen
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    function RideButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/login", {})
        }
        return (
        <button className="button1" onClick={handleClick}>
            Ride
        </button>
        );
    }

    return(
        <nav>
            <span style={{float:"left"}}>
                <NavLink to="/" element={<HomePage />}>ScootEZ</NavLink>
            </span>
            <span className="navBarLinks">
                <NavLink to="/" element={<HomePage />}>About</NavLink>
                <NavLink to="/" element={<HomePage />}>Scooters</NavLink>
                <NavLink to="/" element={<HomePage />}>Map</NavLink>
                <NavLink to="/" element={<HomePage />}>Contact</NavLink>
            </span>
            <span style={{float:"right"}}> <RideButton /> </span>
        </nav>
    );
}