import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminScooterPage() {
    const [isScooterLoaded, setIsScooterLoaded] = useState(false);
    const [scooters, setScooters] = useState(null);
    const [error, setError] = useState(null); 
    const [isFormVisible, setIsFormVisible] = useState(false);

    const { id } = useParams();

    // Function to fetch scooter data
    async function getScooters() {
        try {
            const response = await fetch("http://localhost:5000/api/scooters", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json(); // Return the scooter data
        } catch (error) {
            setError(error.message); // Set error message if fetching fails
            return null;
        }
    }

    // Button component to navigate to the edit page
    function EditInfoButton({ scooterId }) {
        const navigate = useNavigate();
        function handleClick() {
            navigate(`/admin/scooters/${scooterId}`);
        }
        return (
            <button className="button1" onClick={handleClick}>
                EDIT INFO
            </button>
        );
    }

    function AddScooterButton() {
        setIsFormVisible(!isFormVisible); // Toggle form visibility
    }

    async function AddScooterSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newScooter = {
            id: parseInt(formData.get('id'), 10), // Convert to number
            model: formData.get('model'), // Keep as string
            latitude: parseFloat(formData.get('latitude')), // Convert to number
            longitude: parseFloat(formData.get('longitude')), // Convert to number
            battery: parseInt(formData.get('battery'), 10), // Convert to number
            rentalPrice: parseFloat(formData.get('rentalPrice')), // Convert to number
            availability: formData.get('availability') === 'true', // Convert to boolean
            waitTimeMinutes: parseInt(formData.get('waitTimeMinutes'), 10), // Convert to number
        };

        try {
            const response = await fetch("http://localhost:5000/api/add_scooter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newScooter),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            setIsFormVisible(false); 
            setIsScooterLoaded(false); 
        } catch (error) {
            setError(error.message);
        }
    }

    // useEffect to fetch data when the component mounts
    useEffect(() => {
        if (!isScooterLoaded) {
            (async function () {
                const result = await getScooters();
                setIsScooterLoaded(true);
                if (!result) {
                    setError('Failed to load scooter data.');
                } else {
                    setScooters(result.scooters);
                }
            })();
        }
    }, [isScooterLoaded]);

    return (
        <div>
            {error ? (
                <div className="fullBox">
                    <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                        <h1>Error</h1>
                        <h2>{error}</h2>
                    </div>
                </div>
            ) : !isScooterLoaded ? (
                <div className="fullBox">
                    <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                        <h1>Loading...</h1>
                    </div>
                </div>
            ) : (
                <div className="fullBox">
                    <div style={{ width: "70%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                        <h1>Our Scooters</h1>
                        <button 
                            className="addScooterButton" 
                            onClick={AddScooterButton}
                            style={{ marginBottom: '20px' }} 
                        >
                            Add Scooter
                        </button>
                        
                        {/* Popup form */}
                        {isFormVisible && (
                            <div className="addScooterForm">
                                <h2>Add Scooter</h2>
                                <form onSubmit={AddScooterSubmit}>
                                    <label>
                                        Latitude:
                                        <input type="text" name="latitude" required />
                                    </label>
                                    <label>
                                        Longitude:
                                        <input type="text" name="longitude" required />
                                    </label>
                                    <label>
                                        Battery:
                                        <input type="number" name="battery" required />
                                    </label>
                                    <label>
                                        Model:
                                        <input type="text" name="model" required />
                                    </label>
                                    <label>
                                        Availability:
                                        <select name="availability" required>
                                            <option value="true">Available</option>
                                            <option value="false">Not Available</option>
                                        </select>
                                    </label>
                                    <label>
                                        Rental Price:
                                        <input type="number" name="rentalPrice" required />
                                    </label>
                                    <label>
                                        ID:
                                        <input type="text" name="id" required />
                                    </label>
                                    <label>
                                        Wait Time Minutes:
                                        <input type="number" name="waitTimeMinutes" required />
                                    </label>
                                    <button type="submit">Add Scooter</button>
                                    <button type="button" onClick={() => setIsFormVisible(false)}>Close</button>
                                </form>
                            </div>
                        )}
                        <ul className="scooterList">
                            {scooters.map((scooter, index) => (
                                <li className="scooterListItems" key={index}>
                                    <h2>{scooter.model}</h2>
                                    <h3><strong>ID</strong>: {scooter.id}</h3>
                                    <p><strong>Model</strong>: {scooter.model}</p>
                                    <p><strong>Starting location</strong>: {scooter.latitude}, {scooter.longitude}</p>
                                    <p><strong>Battery charge</strong>: {scooter.battery}%</p>
                                    <p><strong>Rental price</strong>: ${scooter.rentalPrice}</p>
                                    <p><strong>Availability</strong>: {scooter.availability ? "available to rent now" : scooter.waitTimeMinutes + " minutes wait"}</p>
                                    <EditInfoButton scooterId={scooter.id} />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
