import React, { useEffect, useState } from 'react';
import styles from '../styles.css';

export default function HomePage() {
    return (
        <div className="fullBox">
            <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                <div style={{ width: "300px", margin: "auto"}} >
                    Rent your ride today with ScootEZ!
                </div>
                <div width="1000px" height="500px">
                    <img src={require("../assets/scooterPhoto1.jpg")} alt="photo of scooters"
                    style={{width: "800px", objectFit: "cover"}}/>
                </div>
            </div>
            
        </div>
    );
}