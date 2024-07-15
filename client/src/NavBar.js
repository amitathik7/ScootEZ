import React, { useEffect, useState, useContext } from 'react';
import styles from './styles.css';
import { NavLink, useNavigate } from 'react-router-dom';

import { ReactComponent as Logo} from './assets/ScootezLogo.svg';
import { IsLoggedInContext } from './App.js';

export default function NavBar() {
    // global context
    const { isLoggedIn, setIsLoggedIn } = useContext(IsLoggedInContext);

    // states
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
                    title: 'ABOUT US',
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
                <div>
                    <button style={{float: "right", marginBottom: "15px"}}
                    type="button" className="navbarLink"
                    aria-haspopup="menu" aria-expanded={isExpanded ? "true" : "false"}
                    onMouseOver={() => setIsExpanded(true)}
                    onClick={() => setIsExpanded((props) => !props)}>
                        {items.title}
                    </button>
                    <Dropdown style={{float: "right"}} submenu={items.submenu} isExpanded={isExpanded} />
                </div>
            );
        }
        else {
            return (
                <NavLink style={{float: "right"}} className="navbarLink" to={items.url}>{items.title}</NavLink>
            );
        }
    }

    // component for the dropdown submenu lists
    function Dropdown({submenu, isExpanded, isAccountDropdown}) {
        if (!isAccountDropdown) {
            return (
                <ul className={isExpanded ? "dropdown Show" : "dropdown Hide"}>
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
                <ul className={isExpanded ? "dropdown Show" : "dropdown Hide"}>
                    {/* map each submenu to its own link */}
                    {submenu.map((submenu, index) => (
                    <li key={index} className="dropdownItems">
                        <NavLink className="navbarLink" to={submenu.url}>{submenu.title}</NavLink>
                    </li>
                    ))}
                    <li className="dropdownItems"><LogoutButton /></li>
                </ul>
            );
        }
    }

    // login button
    function LoginButton() {
        const navigate = useNavigate();
        function handleClick() {
            navigate("/login", {})
        }
        return (
        <button className="button1" onClick={handleClick}>
            LOGIN
        </button>
        );
    }

    // logout button
    function LogoutButton() {
        function handleClick() {
            alert("logout button clicked, but logout hasn't been implemented yet")
        }
        return (
            <button className="navbarLink logout"
            onClick={handleClick}>
                LOGOUT
            </button>
        );
    }

    // account profile button
    function AccountButton() {
        const [isExpanded, setIsExpanded] = useState(false);
        return (
            <div>
                <button style={{float: "right", marginBottom: "15px"}}
                type="button" className="accountCircle"
                aria-haspopup="menu" aria-expanded={isExpanded ? "true" : "false"}
                onMouseOver={() => setIsExpanded(true)}
                onClick={() => setIsExpanded((props) => !props)}>
                    {accountInitials}
                </button>
                <Dropdown style={{float: "right"}} submenu={accountSubmenuItems}
                isExpanded={isExpanded} isAccountDropdown="true" />
            </div>
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
                    <div><NavLink className="navbarLink" to="/">
                        <Logo height={50} fill="#96ea59" />
                    </NavLink></div>
                    <div style={{width: "45%", display: "flex", justifyContent:"space-between"}}>
                        {navBarItems.map((menu, index) => {
                            return (
                                <div style={{width: "200px"}} key={index}>
                                    <MenuItem items={menu} key={index} />
                                </div>
                            );
                        })}
                    </div>
                    <div><LoginButton /></div>
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
                    <div><NavLink className="navbarLink" to="/">
                        <Logo height={50} fill="#96ea59" />
                    </NavLink></div>
                    <div style={{width: "45%", display: "flex", justifyContent:"space-between"}}>
                        {navBarItems.map((menu, index) => {
                            return (
                                <div style={{width: "200px"}} key={index}>
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