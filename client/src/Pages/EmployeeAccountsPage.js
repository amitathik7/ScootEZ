import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App';
import styles from '../styles.css';


// this might not work yet i havent tested it
export default function EmployeeAccountsPage() {
    const { isLoggedIn, isAdmin } = useContext(IsLoggedInContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && isAdmin) {
            fetchUsers();
        } else {
            navigate('/');
        }
    }, [isLoggedIn, isAdmin]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/employees', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleUserClick = (employeeId) => {
        navigate(`/employee/${employeeId}`);
    };

    return (
        <div className="user-accounts-container">
            {users.map((user) => (
                <div key={user._id} className="user-card" onClick={() => handleUserClick(user._id)}>
                    <div className="user-initials">
                        {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </div>
                    <div className="user-name">
                        {user.firstName} {user.lastName}
                    </div>
                </div>
            ))}
        </div>
    );
}
