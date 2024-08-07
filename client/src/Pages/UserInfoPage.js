import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles.css';

export default function UserInfoPage() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [rentalHistory, setRentalHistory] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); 


    useEffect(() => {
        if (id) {
            fetchUser();
            fetchRentalHistory();
        }
    }, [id]);

    // get user
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

    // get user rental history
    async function fetchRentalHistory() {
        try {
            const response = await fetch( `http://localhost:5000/api/users/history/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log("response is ok");
            const data = await response.json();
            console.log('Fetched Rental History:', data);
            setRentalHistory(data);
        }
        catch (error) {
            console.error("error detected: ", error);
            return null;
        }
    } 

    // delete user
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
        function handleClick() {
            deleteUser().then((result) => {
                if (result) {
                    navigate('/admin/users');
                }
            });
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
                <p className="user-address">Address: {user.address}</p>
                <DeleteButton />
                <h2 className="rental-history-title">Rental History</h2>
                {rentalHistory.length === 0 ? (
                    <p className="no-history">No rental history available.</p>
                ) : (
                    <ul className="rental-history-list">
                        {rentalHistory.map((rental, index) => (
                            <li key={index} className="rental-history-item">
                                <h3><strong>Scooter Model:</strong> {rental.scooter.model}</h3>
                                <p><strong>ID:</strong> {rental.scooter.id}</p>
                                <p><strong>Starting Location:</strong> {rental.startLatitude}, {rental.startLongitude}</p>
                                <p><strong>Battery Charge:</strong> {rental.scooter.battery}%</p>
                                <p><strong>Rental Price:</strong> ${Math.trunc(rental.scooter.rentalPrice)}.{(Math.round((rental.scooter.rentalPrice - Math.trunc(rental.scooter.rentalPrice)) * 100)).toString().padStart(2,"0")} per hour</p>
                                <p><strong>Final Price:</strong> ${Math.trunc(rental.cost)}.{(Math.round((rental.cost - Math.trunc(rental.cost)) * 100)).toString().padStart(2,"0")}</p>
                                <p><strong>Time Started:</strong> {new Date(rental.rental_start).toLocaleString()}</p>
                                <p><strong>Time Ended:</strong> {new Date(rental.rental_end).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

