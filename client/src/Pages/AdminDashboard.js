import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 

export default function AdminDashboard() {
    const navigate = useNavigate();

    const handleCreateEmployee = () => {
        navigate('/create-employee'); 
    };

    const handleCreateAdmin = () => {
        navigate('/create-admin'); 
    };

    return (
        <div className="admin-dashboard">
            <button className="circle-button" onClick={handleCreateEmployee}>
                Create an employee account
            </button>
            <button className="circle-button" onClick={handleCreateAdmin}>
                Create an administrator account
            </button>
        </div>
    );
}