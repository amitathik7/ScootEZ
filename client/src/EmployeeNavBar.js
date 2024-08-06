import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from './assets/ScootezLogo.svg';
import { IsLoggedInContext } from './App.js';
import styles from './styles.css';

export default function AdminNavBar() {
    // global context
    const { isLoggedIn, setIsLoggedIn, setIsEmployee } = useContext(IsLoggedInContext);
    const navigate = useNavigate();

    // states
    const [accountInitials, setAccountInitials] = useState(null);

    const employeeNavBarItems = [
        {
            title: 'HOME',
            url: '/employee-dashboard',
        },
        {
            title: 'USERS',
            url: '/admin/users',
        },
        {
            title: 'SCOOTERS',
            url: '/admin/map',
            submenu: [
                {
                    title: 'MAP',
                    url: '/admin/map',
                },
                {
                title: 'SCOOTERS',
                url: '/admin/scooters',
                }
            ],
        },
    ];

    const accountSubmenuItems = [
        {
            title: 'ACCOUNT',
            url: '/employee-profile'
        },
    ];

    // component for each menu item on the nav bar
    function MenuItem({ items }) {
        const [isExpanded, setIsExpanded] = useState(false);

        if (items.submenu) {
            return (
                <div>
                    <button style={{ float: "right", marginBottom: "15px" }}
                        type="button" className="navbarLink"
                        aria-haspopup="menu" aria-expanded={isExpanded ? "true" : "false"}
                        onMouseOver={() => setIsExpanded(true)}
                        onClick={() => setIsExpanded((props) => !props)}> 
                        {items.title}
                    </button>
                    <Dropdown style={{ float: "right" }} submenu={items.submenu} isExpanded={isExpanded} />
                </div>
            );
        }
        else {
            return (
                <NavLink style={{ float: "right" }} className="navbarLink" to={items.url}>{items.title}</NavLink>
            );
        }
    }

    // component for the dropdown submenu lists
    function Dropdown({ submenu, isExpanded, isAccountDropdown }) {
        return (
            <ul className={isExpanded ? "dropdown Show admin" : "dropdown Hide"}>
                {/* map each submenu to its own link */}
                {submenu.map((submenu, index) => (
                    <li key={index} className="dropdownItems">
                        <NavLink className="navbarLink" to={submenu.url}>{submenu.title}</NavLink>
                    </li>
                ))}
                {isAccountDropdown && <li className="dropdownItems"><LogoutButton /></li>}
            </ul>
        );
    }

    // logout button
    function LogoutButton() {
        function handleClick() {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setIsEmployee(false);
            navigate("/");
        }
        return <button className="navbarLink logout" onClick={handleClick}>LOGOUT</button>;
    }

    // account profile button
    function AccountButton() {
        const [isExpanded, setIsExpanded] = useState(false);
        return (
            <div>
                <button style={{ float: "right", marginBottom: "15px" }}
                    type="button" className="accountCircle"
                    aria-haspopup="menu" aria-expanded={isExpanded ? "true" : "false"}
                    onMouseOver={() => setIsExpanded(true)}
                    onClick={() => setIsExpanded((props) => !props)}>
                    {accountInitials}
                </button>
                <Dropdown style={{ float: "right" }} submenu={accountSubmenuItems}
                    isExpanded={isExpanded} isAccountDropdown={true} />
            </div>
        );
    }

    async function getAccountName() {
        try {    
            const response = await fetch('http://localhost:5000/api/employee/accountName', {
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

    if (isLoggedIn) {
        getAccountName().then((fullName) => {
            setAccountInitials(fullName.firstName.charAt(0) + fullName.lastName.charAt(0));
        });
    }

    return(
        <nav className="darkGreenNav">
            <div style={{width: "96%", marginLeft: "2%", display: "flex", justifyContent:"space-between"}}>
                <div><NavLink className="navbarLink" to="/admin-dashboard">
                    <Logo height={50} fill="#96ea59" />
                </NavLink></div>
                <div style={{width: "45%", display: "flex", justifyContent:"space-between"}}>
                    {employeeNavBarItems.map((menu, index) => {
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



