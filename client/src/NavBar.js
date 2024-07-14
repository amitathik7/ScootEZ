import React, { useEffect, useState, useContext } from 'react';
import styles from './styles.css';
import { NavLink, useNavigate} from 'react-router-dom';

import { ReactComponent as Logo} from './ScootezLogo.svg';

import { AccountContext, IsLoggedInContext } from './App.js';
import HomePage from "./Pages/HomePage.js";
import LoginPage from "./Pages/LoginPage.js";
import AboutPage from './Pages/AboutPage.js';
import ScooterPage from './Pages/ScooterPage.js';
import MapPage from './Pages/MapPage.js';
import ProfilePage from './Pages/ProfilePage.js';


export default function NavBar() {
    // The display case for the screen
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);
    const { account, setAccount } = useContext(AccountContext);

    function RideButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/login", {})
        }
        return (
        <button className="button1" onClick={handleClick}>
            RENT YOUR RIDE
        </button>
        );
    }

    if (!isLoggedIn) {
        return(
            <nav>
                <div style={{width: "96%", marginLeft: "2%", display: "flex", justifyContent:"space-between"}}>
                    <div><NavLink className="navbarLink" to="/" element={<HomePage />}>
                        <Logo height={50} fill="#96ea59" />
                    </NavLink></div>
                    <div style={{width: "30%", display: "flex", justifyContent:"space-between"}}>
                        <div><NavLink className="navbarLink" to="/about" element={<AboutPage />}>ABOUT</NavLink></div>
                        <div><NavLink className="navbarLink" to="/scooters" element={<HomePage />}>SCOOTERS</NavLink></div>
                        <div><NavLink className="navbarLink" to="/map" element={<MapPage />}>MAP</NavLink></div>
                    </div>
                    <div><RideButton /></div>
                </div>
            </nav>
        );
    }
    else {
        return(
            <nav>
                <div style={{width: "96%", marginLeft: "2%", display: "flex", justifyContent:"space-between"}}>
                    <div><NavLink className="navbarLink" to="/" element={<HomePage />}>
                        <Logo height={50} fill="#96ea59" />
                    </NavLink></div>
                    <div style={{width: "30%", display: "flex", justifyContent:"space-between"}}>
                        <div><NavLink className="navbarLink" to="/" element={<HomePage />}>HOME</NavLink></div>
                        <div><NavLink className="navbarLink" to="/profile" element={<ProfilePage />}>PROFILE</NavLink></div>
                    </div>
                    <div>{account}</div>
                </div>
            </nav>
        );
    }

    
}