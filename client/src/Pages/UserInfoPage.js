import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function UserInfoPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 


    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            setError('Error fetching user data', error);
            console.error('Error fetching user:', error);
        }
    };

    const deleteUser = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: user.id }), 
            });

            if (!response.ok) {
                throw new Error('Failed to delete user');
            }

            navigate('/'); 
        } catch (error) {
            setError('Error deleting user');
            console.error('Error deleting user:', error);
        }
    };

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user.firstName} {user.lastName}</h1>
            <p>Email: {user.email}</p>
            <p>Address: {user.address}</p>
            <button onClick={deleteUser} style={{ backgroundColor: 'red', color: 'white' }}>
                Delete Account
            </button>
        </div>
    );
}
