import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function EmployeeInfoPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    const fetchUser = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/employee/${id}`, {
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

    const deleteEmployee = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/employee/delete`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            navigate('/'); 
        } catch (error) {
            setError('Error deleting employee');
            console.error('Error deleting employee:', error);
        }
    };

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>{user.firstName} {user.lastName}</h1>
            <p>Email: {user.email}</p>
            <button onClick={deleteEmployee} style={{ backgroundColor: 'red', color: 'white' }}>
                Delete Account
            </button>
        </div>
    );
}