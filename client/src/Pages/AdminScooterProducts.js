import React, { useState, useEffect } from 'react';
import { useParams, Navigate, NavLink, useNavigate } from 'react-router-dom';

export default function AdminScooterProducts() {
    const { id } = useParams();
    const [isScooterLoaded, setIsScooterLoaded] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
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

    const navigate = useNavigate();

    async function getScooters() {
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
                const data = await response.json();
                setScooterInfo(data); 
                setIsScooterLoaded(true);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("error detected: ", error);
            setIsScooterLoaded('error');
           // return null;
        }
    }
    useEffect(() => {
        getScooters();
    }, [id]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScooterInfo({
            ...scooterInfo,
            [name]: value,
        });
    };

    const handleSave = async () => {
        console.log("handleSave function called"); 

        try {
            console.log("Sending data:", scooterInfo);
            const response = await fetch("http://localhost:5000/api/scooters/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ scooter_id: scooterInfo._id, newData: scooterInfo }),
            });
            if (response.ok) {
                const updatedScooter = await response.json();
                console.log('Updated scooter data:', updatedScooter);
                setScooterInfo(updatedScooter);
                setIsEditing(false);
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Network response was not ok');
            }
        } catch (error) {
            console.error("Error updating scooter info:", error);
            alert(`Error updating scooter info: ${error.message}`);
        }
    };



const handleDelete = async () => {
    try {
        const response = await fetch(`http://localhost:5000/api/delete_scooter?scooter_id=${scooterInfo._id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`,
            }
        });

        if (response.ok) {
            alert('Scooter deleted successfully.');
            navigate('/admin/scooters');
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Network response was not ok');
        }
    } catch (error) {
        console.error("Error deleting scooter:", error);
        alert(`Error deleting scooter: ${error.message}`);
    }
};

if (isScooterLoaded === 'error') {
    return <Navigate to='/admin/scooters' />;
}

return (
    <div className="fullBox">
        <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
            <h1>{scooterInfo.model}</h1>
            <h2>Scooter information:</h2>
            <ul>
                {isEditing ? (
                    <>
                        <li>
                            <label>Model: </label>
                            <input
                                type="text"
                                name="model"
                                value={scooterInfo.model}
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Latitude: </label>
                            <input
                                type="number"
                                name="latitude"
                                value={scooterInfo.latitude}
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Longitude: </label>
                            <input
                                type="number"
                                name="longitude"
                                value={scooterInfo.longitude}
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Battery: </label>
                            <input
                                type="number"
                                name="battery"
                                value={scooterInfo.battery}
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Rental Price: </label>
                            <input
                                type="number"
                                name="rentalPrice"
                                value={scooterInfo.rentalPrice}
                                onChange={handleInputChange}
                            />
                        </li>
                        <li>
                            <label>Availability: </label>
                            <input
                                type="checkbox"
                                name="availability"
                                checked={scooterInfo.availability}
                                onChange={(e) =>
                                    setScooterInfo({
                                        ...scooterInfo,
                                        availability: e.target.checked,
                                    })
                                }
                            />
                        </li>
                        <li>
                            <label>Wait Time Minutes: </label>
                            <input
                                type="number"
                                name="waitTimeMinutes"
                                value={scooterInfo.waitTimeMinutes}
                                onChange={handleInputChange}
                            />
                        </li>
                    </>
                ) : (
                    <>
                        <li><strong>Model</strong>: {scooterInfo.model}</li>
                        <li><strong>Starting location</strong>: {scooterInfo.latitude}, {scooterInfo.longitude}</li>
                        <li><strong>Battery charge</strong>: {scooterInfo.battery}%</li>
                        <li><strong>Rental price</strong>: ${scooterInfo.rentalPrice}</li>
                        <li><strong>Availability</strong>: {scooterInfo.availability ? "available to rent now" : scooterInfo.waitTimeMinutes + " minutes wait"}</li>
                    </>
                )}
            </ul>
            <button className="save" onClick={() => {
                    if (isEditing) {
                        handleSave();
                    }
                    setIsEditing(!isEditing);
                }}>
                    {isEditing ? 'Save' : 'Edit'}
                </button>
                <button className="delete" onClick={handleDelete}>
                        Delete Scooter
                </button>
            </div>
        </div>
    );
}