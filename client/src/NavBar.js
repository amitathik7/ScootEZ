import React, { useEffect, useState, useContext, useRef } from 'react';
import styles from './styles.css';
import { NavLink, useNavigate} from 'react-router-dom';

import { ReactComponent as Logo} from './ScootezLogo.svg';

import { IsLoggedInContext } from './App.js';
import HomePage from "./Pages/HomePage.js";
import AboutPage from './Pages/AboutPage.js';
import MapPage from './Pages/MapPage.js';
import FaqPage from './Pages/FaqPage.js';
import ScooterPage from './Pages/ScooterPage.js';

import ProfilePage from './Pages/ProfilePage.js';


export default function NavBar() {
    // The display case for the screen
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);
    const [accountInitials, setAccountInitials] = useState(null);

    // The nav bar structure
    const navBarItems = [
        {
            title: 'HOME',
            url: '/',
        },
        {
            title: 'ABOUT',
            url: '/about',
            submenu: [
                {
                    title: 'ABOUT',
                    url: '/about',
                },
                {
                title: 'SCOOTERS',
                url: '/scooters',
                }
            ],
        },
        {
            title: 'RENT',
            url: '/map',
        },
        {
            title: 'FAQ',
            url: '/faq',
        },
    ];

    const accountSubmenuItems = [
        {
            title: 'ACCOUNT',
            url: '/profile'
        },
        {
            title: 'MY RENTALS',
            url: '/current-rentals'
        }
    ]

    // component for each menu item on the nav bar
    function MenuItem({ items }) {
        const [isExpanded, setIsExpanded] = useState(false);

        if (items.submenu) {
            return (
                <>
                    <button type="button" className="navbarLink"
                    aria-haspopup="menu" aria-expanded={isExpanded ? "true" : "false"}
                    onMouseOver={() => setIsExpanded((props) => !props)}
                    onClick={() => setIsExpanded((props) => !props)}>
                        {items.title}
                    </button>
                    <Dropdown submenu={items.submenu} isExpanded={isExpanded} />
                </>
            );
        }
        else {
            return (
                <NavLink className="navbarLink" to={items.url}>{items.title}</NavLink>
            );
        }
    }

    function Dropdown({submenu, isExpanded, isAccountDropdown}) {
        if (!isAccountDropdown) {
            return (
                <ul className={isExpanded ? "dropdownShow" : "dropdownHide"}>
                    {/* map each submenu to its own link */}
                    {submenu.map((submenu, index) => (
                    <li key={index} className="dropdownItems">
                        <NavLink className="navbarLink" to={submenu.url}>{submenu.title}</NavLink>
                    </li>
                    ))}
                </ul>
            );
        }
        else {
            return (
                <ul className={isExpanded ? "dropdownShow" : "dropdownHide"}>
                    {/* map each submenu to its own link */}
                    {submenu.map((submenu, index) => (
                    <li key={index} className="dropdownItems">
                        <NavLink className="navbarLink" to={submenu.url}>{submenu.title}</NavLink>
                    </li>
                    ))}
                    <li><LogoutButton /></li>
                </ul>
            );
        }
    }

    // login button
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

    // login button
    function LogoutButton() {
        function handleClick() {
            alert("logout button clicked, but logout hasn't been implemented yet")
        }
        return (
            <button className="navbarLink logout" onClick={handleClick}>
                LOGOUT
            </button>
        );
    }

    // account profile button
    function AccountButton() {
        const [isExpanded, setIsExpanded] = useState(false);
        return (
            <>
                <button type="button" className="accountCircle"
                aria-haspopup="menu" aria-expanded={isExpanded ? "true" : "false"}
                onMouseOver={() => setIsExpanded((props) => !props)}
                onClick={() => setIsExpanded((props) => !props)}>
                    {accountInitials}
                </button>
                <Dropdown submenu={accountSubmenuItems} isExpanded={isExpanded} isAccountDropdown="true" />
            </>
        );
    }

    async function getAccountName() {
        try {    
            const response = await fetch('http://localhost:5000/api/users/accountName', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json',
                },
            });
            const fullName = await response.json();
            return fullName;    // fullName is an object of { firstName, lastName }
        }
        catch (error) {
            console.error("error encountered in getting name" + error);
        }
    }

    if (!isLoggedIn) {
        return(
            <nav>
                <div style={{width: "96%", marginLeft: "2%", display: "flex", justifyContent:"space-between"}}>
                    <div><NavLink className="navbarLink" to="/" element={<HomePage />}>
                        <Logo height={50} fill="#96ea59" />
                    </NavLink></div>
                    <div style={{width: "45%", display: "flex", justifyContent:"space-between"}}>
                        {navBarItems.map((menu, index) => {
                            return (
                                <div key={index}>
                                    <MenuItem items={menu} key={index} />
                                </div>
                            );
                        })}
                    </div>
                    <div><RideButton /></div>
                </div>
            </nav>
        );
    }
    else {
        console.log("working to get name");
        getAccountName().then((fullName) => {
            // set the account name to be the initials
            setAccountInitials(fullName.firstName.charAt(0) + " " + fullName.lastName.charAt(0));
        })

        return(
            <nav>
                <div style={{width: "96%", marginLeft: "2%", display: "flex", justifyContent:"space-between"}}>
                    <div><NavLink className="navbarLink" to="/" element={<HomePage />}>
                        <Logo height={50} fill="#96ea59" />
                    </NavLink></div>
                    <div style={{width: "45%", display: "flex", justifyContent:"space-between"}}>
                        {navBarItems.map((menu, index) => {
                            return (
                                <div key={index}>
                                    <MenuItem items={menu} key={index} />
                                </div>
                            );
                        })}
                    </div>
                    <div><AccountButton /></div>
                </div>
            </nav>
        );
    }

    
}