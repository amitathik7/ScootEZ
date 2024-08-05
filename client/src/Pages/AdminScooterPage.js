import React, { useState, useEffect } from 'react'; // Ensure useEffect is imported
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminScooterPage() {
    const [isScooterLoaded, setIsScooterLoaded] = useState(false);
    const [scooters, setScooters] = useState(null);
    const [error, setError] = useState(null); // State to track errors

    const { id } = useParams();

    // Function to fetch scooter data
    async function getScooters() {
        try {
            const response = await fetch("http://localhost:5000/api/scooters", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
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
            navigate(`admin/scooters/${scooterId}`, {});
        }
        return (
            <button className="button1" onClick={handleClick}>
                EDIT INFO
            </button>
        );
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
