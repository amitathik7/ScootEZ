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

    async function deleteUser() {
        try {
            const response = await fetch(`http://localhost:5000/api/users/delete/${id}`, {
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

            return true;
        } catch (error) {
            setError('Error deleting user');
            console.error('Error deleting user:', error);
            return false;
        }
    }

    function DeleteButton() {
        const navigate = useNavigate();
        function handleClick() {
            deleteUser().then((result) => {
                if (result) {
                    navigate('/admin/users')
                }
            })
        }
        return (
            <button onClick={handleClick} style={{ backgroundColor: 'red', color: 'white' }}>
                Delete Account
            </button>
        )
    }

    if (error) return <div>{error}</div>;
    if (!user) return <div>Loading...</div>;

    return (
        <div className="fullBox">
            <div style={{width: "50%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>{user.firstName} {user.lastName}</h1>
                <p>Email: {user.email}</p>
                <p>Address: {user.address}</p>
                <DeleteButton />
            </div>
        </div>
    );
}
