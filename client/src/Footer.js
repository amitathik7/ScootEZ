import React from 'react';
import styles from './styles.css';
import { NavLink, useNavigate} from 'react-router-dom';

import { ReactComponent as Logo} from './ScootezLogo.svg';

import HomePage from "./Pages/HomePage.js";
import AboutPage from './Pages/AboutPage.js';

export default function Footer() {
    return(
        <div className="footer">
            <div><NavLink to="/" element={<HomePage />}>
                <Logo height={30} fill="#96ea59" />
            </NavLink></div>
            <div><NavLink className="footerLink" to="/about" element={<AboutPage />}>ABOUT</NavLink></div>
            <div><p>+1 (123)-456-7890</p></div>
            <div><p>help@scootez.com</p></div>
        </div>
    );
}