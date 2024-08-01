// import React, { useState, useEffect } from 'react';
// import { useParams, Navigate, NavLink } from 'react-router-dom';

// export default function AdminScooterPage() {
//     // this is the scooter id from the url
//     const {id} = useParams();

//     const [isScooterLoaded, setIsScooterLoaded] = useState('false');
//     const [scooterInfo, setScooterInfo] = useState({
//         id: null,
//         model: '',
//         latitude: null,
//         longitude: null,
//         battery: null,
//         availability: false,
//         rentalPrice: null,
//         waitTimeMinutes: null
//     });

//     // get scooter info from backend (from DB)
//     async function getScooters() {
//         try {
//             const response = await fetch(
//                 "http://localhost:5000/api/scooters/find",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify({scooterId: id})
//                 }
//             );
//             if (response.ok) {
//                 console.log("response is ok");
//                 return await response.json(); // scooter object
//             }
//             else {
//                 throw new Error('Network response was not ok');
//             }
//         }
//         catch (error) {
//             console.error("error detected: ", error);
//             return null;
//         }
//     }
    
//     if (isScooterLoaded === 'false') {
//         // get scooter info function
//         (async function(){
//             console.log("getting scooter info...");
//             const result = await getScooters();
//             setIsScooterLoaded('true');
//             if (!result) {
//                 console.log("result is null")
//                 // go back to scooter page - this scooter doesn't exist
//                 setIsScooterLoaded('error');
//             }
//             else {
//                 console.log("setting scooter info...");
//                 setScooterInfo(result);
//             }
//         })();
    
//         return (
//             <div className="fullBox">
//                 <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
//                     <h1>One Moment</h1>
//                     <h2>Loading scooter information...</h2>
//                 </div>
//             </div>
//         );
//     }
//     else if (isScooterLoaded === 'true') {
//         return (
//             <div className="fullBox">
//             <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
//                 <h1>{scooterInfo.model}</h1>
//                 <h2>Scooter information:</h2>
//                 <ul>
//                     <li><strong>Model</strong>: {scooterInfo.model}</li>
//                     <li><strong>Starting location</strong>: {scooterInfo.latitude}, {scooterInfo.longitude}</li>
//                     <li><strong>Battery charge</strong>: {scooterInfo.battery}%</li>
//                     <li><strong>Rental price</strong>: ${scooterInfo.rentalPrice}</li>
//                     <li><strong>Availability</strong>: { scooterInfo.availability ? "availabile to rent now" : scooterInfo.waitTimeMinutes + " minutes wait" }</li>
//                 </ul>

//                 <NavLink className="button1" to={`/admin/scooters/${scooterInfo.id}`}>EDIT</NavLink>
//             </div>
//         </div>
//         );
//     }
//     else {
//         return (
//             <Navigate to='/admin/scooters' />
//         );
//     }
// }

import React, { useState, useEffect } from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';

export default function AdminScooterProducts() {
    const { id } = useParams();
    const [isScooterLoaded, setIsScooterLoaded] = useState('false');
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
                setScooterInfo(data); // Ensure this is a valid object
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("error detected: ", error);
            setIsScooterLoaded('error');
           // return null;
        }
    }

    if (isScooterLoaded === 'false') {
        (async function () {
            const result = await getScooters();
            setIsScooterLoaded('true');
            if (!result) {
                setIsScooterLoaded('error');
            } else {
                setScooterInfo(result);
            }
        })();

        return (
            <div className="fullBox">
                <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
                    <h1>One Moment</h1>
                    <h2>Loading scooter information...</h2>
                </div>
            </div>
        );
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setScooterInfo({
            ...scooterInfo,
            [name]: value,
        });
    };

    const handleSave = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/scooters/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ ...scooterInfo, id: scooterInfo.id.toString() }),
            });
            if (response.ok) {
                const updatedScooter = await response.json();
                setScooterInfo(updatedScooter);
                setIsEditing(false);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("Error updating scooter info:", error);
        }
    };

    if (isScooterLoaded === 'true') {
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
                    <button className="button1" onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                </div>
            </div>
        );
    } else {
        return (
            <Navigate to='/admin/scooters' />
        );
    }
}
