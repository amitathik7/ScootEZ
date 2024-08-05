import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsLoggedInContext } from '../App';
import styles from '../styles.css';

export default function UserAccountsPage() {
    const { isLoggedIn, isAdmin, isEmployee } = useContext(IsLoggedInContext);
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn && (isAdmin || isEmployee)) {
            fetchUsers();
        } else {
            navigate('/login');
        }
    }, [isLoggedIn, isAdmin, isEmployee]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users', {
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

    const handleUserClick = (userId) => {
        navigate(`/user/${userId}`);
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
