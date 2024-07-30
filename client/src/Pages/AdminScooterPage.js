import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';

export default function AdminScooterPage() {
    const { id } = useParams();

    const [isScooterLoaded, setIsScooterLoaded] = useState('false');
    const [scooterInfo, setScooterInfo] = useState({
        id: null,
        model: '',
        latitude: null,
        longitude: null,
        battery: null,
        availability: false,
        rentalPrice: null,
        waitTimeMinutes: null
    });

    async function getScooter() {
        try {
            const response = await fetch(
                "http://localhost:5000/api/scooters/find",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ scooterId: id })
                }
            );
            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("error detected: ", error);
            return null;
        }
    }

    async function updateScooter(updatedInfo) {
        try {
            const response = await fetch(
                "http://localhost:5000/api/scooters/update",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(updatedInfo)
                }
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("error detected: ", error);
        }
    }

    useEffect(() => {
        (async function () {
            const result = await getScooter();
            setIsScooterLoaded('true');
            if (!result) {
                setIsScooterLoaded('error');
            } else {
                setScooterInfo(result);
            }
        })();
    }, []);

    if (isScooterLoaded === 'false') {
        return (
            <div className="fullBox">
                <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                    <h1>One Moment</h1>
                    <h2>Loading scooter information...</h2>
                </div>
            </div>
        );
    } else if (isScooterLoaded === 'true') {
        const handleChange = (e) => {
            const { name, value } = e.target;
            setScooterInfo(prevInfo => ({
                ...prevInfo,
                [name]: value
            }));
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            await updateScooter(scooterInfo);
            alert("Scooter information updated successfully!");
        };

        return (
            <div className="fullBox">
                <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                    <h1>Edit {scooterInfo.model}</h1>
                    <h2>Scooter information:</h2>
                    <form onSubmit={handleSubmit}>
                        <ul>
                            <li>
                                <label>Model:</label>
                                <input type="text" name="model" value={scooterInfo.model} onChange={handleChange} />
                            </li>
                            <li>
                                <label>Starting location (latitude):</label>
                                <input type="number" name="latitude" value={scooterInfo.latitude} onChange={handleChange} />
                            </li>
                            <li>
                                <label>Starting location (longitude):</label>
                                <input type="number" name="longitude" value={scooterInfo.longitude} onChange={handleChange} />
                            </li>
                            <li>
                                <label>Battery charge:</label>
                                <input type="number" name="battery" value={scooterInfo.battery} onChange={handleChange} />
                            </li>
                            <li>
                                <label>Rental price:</label>
                                <input type="number" name="rentalPrice" value={scooterInfo.rentalPrice} onChange={handleChange} />
                            </li>
                            <li>
                                <label>Availability:</label>
                                <select name="availability" value={scooterInfo.availability} onChange={handleChange}>
                                    <option value={true}>Available</option>
                                    <option value={false}>Not Available</option>
                                </select>
                            </li>
                            <li>
                                <label>Wait time (minutes):</label>
                                <input type="number" name="waitTimeMinutes" value={scooterInfo.waitTimeMinutes} onChange={handleChange} />
                            </li>
                        </ul>
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        );
    } else {
        return <Navigate to='/admin/scooters' />;
    }
}
