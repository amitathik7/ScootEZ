import React from 'react';

export default function AboutPage() {
    return(
        <div className="fullBox">
            <div style={{width: "50%", placeSelf: "center", display: "inline-block", lineHeight: "40px"}}>
                <h1>About Us</h1>
                <p>
                    ScootEZ is a fictional scooter rental service located in Gainesville, FL on and around the University of Florida campus.
                    We ...
                </p>
                <br/>
                <h1>The Development Team</h1>
                <ul>
                    <li>Jaidyn Holt</li>
                    <li>Amit Athi Kesavan</li>
                    <li>Annabel Stocks Natalias</li>
                    <li>Elan Bar-Nur</li>
                </ul>
                <br/>
                <h1>The Project</h1>
                <p>
                    ScootEZ is a software engineering project for the course CEN3031 Introduction to Software Engineering, summer 2024.
                    In response to the challenge of designing a tracking system for an electric scooter rental service,
                    this is a web application connected to a server using the react.JS and Node.JS frameworks.
                    The application is able to create three different types of accounts, customer, employee, and administrator,
                    which will have their appropriate functionalities according to the client’s requirements.
                    It stores the scooter information and account information in a local database.
                </p>

            </div>
        </div>
    );
}