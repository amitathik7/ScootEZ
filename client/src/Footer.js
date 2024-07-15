import React from 'react';
import styles from './styles.css';
import { NavLink, useNavigate} from 'react-router-dom';

import { ReactComponent as Logo} from './assets/ScootezLogo.svg';

import HomePage from "./Pages/HomePage.js";
import AboutPage from './Pages/AboutPage.js';
import EmployeeLoginPage from './Pages/EmployeeLoginPage.js';
import AdminLoginPage from './Pages/AdminLoginPage.js';


export default function Footer() {
    return(
        <div className="footer">
            <div><NavLink to="/" element={<HomePage />}>
                <Logo height={30} fill="#96ea59" />
            </NavLink></div>
            <div><NavLink className="footerLink" to="/about" element={<AboutPage />}>ABOUT</NavLink></div>
            <div><p>+1 (123)-456-7890</p></div>
            <div><p>help@scootez.com</p></div>
            <div>
                <NavLink to="/employee-login">
                    <button className={`button5 ${styles['button5']}`}>
                        Employee Login
                    </button>
                </NavLink>
            </div>
                <NavLink to="/admin-login">
                    <button className={`button5 ${styles['button5']}`}>
                        Administrator Login
                    </button>
                </NavLink>
            </div>
    );
}
