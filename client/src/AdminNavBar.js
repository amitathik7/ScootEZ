import React, { useState, useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as Logo } from './assets/ScootezLogo.svg';
import { IsLoggedInContext } from './App.js';
import styles from './styles.css';

export default function AdminNavBar() {
    // global context
    const { isLoggedIn } = useContext(IsLoggedInContext);

    // states
    const [accountInitials, setAccountInitials] = useState(null);

    const adminNavBarItems = [
        {
            title: 'HOME',
            url: '/admin/home',
        },
        {
            title: 'EMPLOYEES',
            url: '/admin/employees',
        },
        {
            title: 'USERS',
            url: '/admin/users',
        },
        {
            title: 'SCOOTERS',
            url: '/admin/scooters',
        },
    ];

    const accountSubmenuItems = [
        {
            title: 'ACCOUNT',
            url: '/profile'
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
            <ul className={isExpanded ? "dropdown Show" : "dropdown Hide"}>
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
            alert("logout button clicked, but logout hasn't been implemented yet");
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

    return(
        <nav className="darkGreenNav">
            <div style={{width: "96%", marginLeft: "2%", display: "flex", justifyContent:"space-between"}}>
                <div><NavLink className="navbarLink" to="/admin-dashboard">
                    <Logo height={50} fill="#96ea59" />
                </NavLink></div>
                <div style={{width: "45%", display: "flex", justifyContent:"space-between"}}>
                    {adminNavBarItems.map((menu, index) => {
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


