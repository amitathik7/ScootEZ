import React, { useEffect, useState } from 'react';
import styles from '../styles.css';

export default function HomePage() {
    return (
        <div className="fullBox">
            <div className="greenStripe"/>
            <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                <div style={{width: "30%", margin: "auto"}}>
                    Hello
                </div>
                <div style={{width: "80%"}}>
                    <img src={require("../assets/scooterPhoto1.jpg")} alt="photo of scooters"
                    style={{width: "800px", height: "500px", objectFit: "cover"}}/>
                </div>
            </div>
            
        </div>
    );
}