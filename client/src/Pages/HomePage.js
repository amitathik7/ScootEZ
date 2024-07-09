import React, { useEffect, useState } from 'react';
import styles from '../styles.css';

export default function HomePage() {
    return (
        <div className="fullBox">
            <div style={{width: "40%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>Rent your ride today with ScootEZ!</h1>
                <p>
                    Info text!!
                </p>
                <br/>
                <h1>Great for student life on the go!</h1>
                <p>
                    Info text!! Pictures! Links!
                </p>
                <br/>
            </div>
        </div>
    );
}