import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function EmployeeInfoPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (id) {
            fetchUser();
        }
    }, [id]);

    // get employee
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

    // delete employee
    async function deleteEmployee() {
        try {
            const response = await fetch(`http://localhost:5000/api/employee/delete/${id}`, { 
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete employee');
            }

            return true;
        } catch (error) {
            setError('Error deleting employee');
            console.error('Error deleting employee:', error);
            return false;
        }
    };

    function DeleteButton() {
        const navigate = useNavigate();
        function handleClick() {
            deleteEmployee().then((result) => {
                if (result) {
                    navigate('/admin/employees')
                }
            })
        }
        return (
            <button className="delete" onClick={handleClick}>
                Delete Account
            </button>
        );
    }

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className="fullBox">
            <div className="user-info-container">
                <h1 className="user-name">{user.firstName} {user.lastName}</h1>
                <p className="user-email">Email: {user.email}</p>
                <DeleteButton />
            </div>
        </div>
    );
}