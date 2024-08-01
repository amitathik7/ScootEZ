// import React, { useState, useEffect } from 'react';
// import { useParams, Navigate } from 'react-router-dom';

// export default function AdminScooterPage() {
//     //const { id } = useParams();

//     const [isScooterLoaded, setIsScooterLoaded] = useState('false');
//     const [scooterInfo, setScooterInfo] = useState(null);
//         // id: null,
//         // model: '',
//         // latitude: null,
//         // longitude: null,
//         // battery: null,
//         // availability: false,
//         // rentalPrice: null,
//         // waitTimeMinutes: null
//     //});

//     // async function getScooter() {
//     //     try {
//     //         const response = await fetch(
//     //             "http://localhost:5000/api/scooters/find",
//     //             {
//     //                 method: "POST",
//     //                 headers: {
//     //                     "Content-Type": "application/json",
//     //                 },
//     //                 body: JSON.stringify({ scooterId: id })
//     //             }
//     //         );
//     //         if (response.ok) {
//     //             return await response.json();
//     //         } else {
//     //             throw new Error('Network response was not ok');
//     //         }
//     //     } catch (error) {
//     //         console.error("error detected: ", error);
//     //         return null;
//     //     }
//     // }

//         // get scooter info from backend (from DB)
//         async function getScooters() {
//             try {
//                 const response = await fetch(
//                     "http://localhost:5000/api/scooters",
//                     {
//                         method: "GET",
//                         headers: {
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }
//                 console.log("response is ok");
//                 return await response.json(); // scooter object
//             }
//             catch (error) {
//                 console.error("error detected: ", error);
//                 return null;
//             }
//         }

//     async function updateScooter(updatedInfo) {
//         try {
//             const response = await fetch(
//                 "http://localhost:5000/api/scooters/update",
//                 {
//                     method: "POST",
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     body: JSON.stringify(updatedInfo)
//                 }
//             );
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//         } catch (error) {
//             console.error("error detected: ", error);
//         }
//     }

//     useEffect(() => {
//         (async function () {
//             const result = await getScooter();
//             setIsScooterLoaded('true');
//             if (!result) {
//                 setIsScooterLoaded('error');
//             } else {
//                 setScooterInfo(result);
//             }
//         })();
//     }, []);

//     if (isScooterLoaded === 'false') {
//         return (
//             <div className="fullBox">
//                 <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
//                     <h1>One Moment</h1>
//                     <h2>Loading scooter information...</h2>
//                 </div>
//             </div>
//         );
//     } else if (isScooterLoaded === 'true') {
//         const handleChange = (e) => {
//             const { name, value } = e.target;
//             setScooterInfo(prevInfo => ({
//                 ...prevInfo,
//                 [name]: value
//             }));
//         };

//         const handleSubmit = async (e) => {
//             e.preventDefault();
//             await updateScooter(scooterInfo);
//             alert("Scooter information updated successfully!");
//         };

//         return (
//             <div className="fullBox">
//                 <div style={{ width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px" }}>
//                     <h1>Edit {scooterInfo.model}</h1>
//                     <h2>Scooter information:</h2>
//                     <form onSubmit={handleSubmit}>
//                         <ul>
//                             <li>
//                                 <label>Model:</label>
//                                 <input type="text" name="model" value={scooterInfo.model} onChange={handleChange} />
//                             </li>
//                             <li>
//                                 <label>Starting location (latitude):</label>
//                                 <input type="number" name="latitude" value={scooterInfo.latitude} onChange={handleChange} />
//                             </li>
//                             <li>
//                                 <label>Starting location (longitude):</label>
//                                 <input type="number" name="longitude" value={scooterInfo.longitude} onChange={handleChange} />
//                             </li>
//                             <li>
//                                 <label>Battery charge:</label>
//                                 <input type="number" name="battery" value={scooterInfo.battery} onChange={handleChange} />
//                             </li>
//                             <li>
//                                 <label>Rental price:</label>
//                                 <input type="number" name="rentalPrice" value={scooterInfo.rentalPrice} onChange={handleChange} />
//                             </li>
//                             <li>
//                                 <label>Availability:</label>
//                                 <select name="availability" value={scooterInfo.availability} onChange={handleChange}>
//                                     <option value={true}>Available</option>
//                                     <option value={false}>Not Available</option>
//                                 </select>
//                             </li>
//                             <li>
//                                 <label>Wait time (minutes):</label>
//                                 <input type="number" name="waitTimeMinutes" value={scooterInfo.waitTimeMinutes} onChange={handleChange} />
//                             </li>
//                         </ul>
//                         <button type="submit">Update</button>
//                     </form>
//                 </div>
//             </div>
//         );
//     } else {
//         return <Navigate to='/admin/scooters' />;
//     }
// }

// src/pages/AdminProfilePage.jsx


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
