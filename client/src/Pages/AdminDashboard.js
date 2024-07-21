import React, { useEffect, useState } from 'react';

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchUsers() {
            const token = localStorage.getItem("token");
            console.log('Token:', token); // Log the token to verify it is being retrieved

            try {
                const response = await fetch('http://localhost:5000/api/users', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched users:', data);
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users: ", error);
                setError(error.message);
            }
        }
        fetchUsers();
    }, []);

    if (error) {
        return <div style={{ fontSize: '1.5em', textAlign: 'center', marginTop: '20px' }}>Error: {error}</div>;
    }

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '10px',
            padding: '20px'
        }}>
            {users.length === 0 && <div style={{ fontSize: '1.5em', textAlign: 'center', marginTop: '20px' }}>Loading...</div>}
            {users.map((user, index) => (
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'green',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.2em',
                    textAlign: 'center',
                    cursor: 'pointer'
                }} key={user.id || index} onClick={() => alert(`Clicked on ${user.firstName} ${user.lastName}`)}>
                    {user.firstName ? `${user.firstName[0]}${user.lastName[0]}` : 'User'}
                </div>
            ))}
        </div>
    );
}