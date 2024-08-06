import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 

export default function EmployeeDashboard() {
    return (
        <div className="fullBox">
            <div style={{width: "50%", placeSelf: "center", display: "inline-block", lineHeight: "40px", height: "500px"}}>
                <h1>Employee Dashboard</h1>
            </div>
        </div>
    );
}