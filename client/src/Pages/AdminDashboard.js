import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 

export default function AdminDashboard() {
    const navigate = useNavigate();

    // go to create employee page
    const handleCreateEmployee = () => {
        navigate('/create-employee'); 
    };

    // go to create admin page
    const handleCreateAdmin = () => {
        navigate('/create-admin'); 
    };

    return (
        <div className="admin-dashboard">
            <div className="dashboard-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your team efficiently and effectively</p>
            </div>
            <div className="dashboard-buttons">
                <div className="dashboard-button" onClick={handleCreateEmployee}>
                    <img src="https://cdn-icons-png.flaticon.com/512/1256/1256650.png" alt="Create Employee" />
                    <p>Create an employee account</p>
                </div>
                <div className="dashboard-button" onClick={handleCreateAdmin}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="Create Admin" />
                    <p>Create an administrator account</p>
                </div>
            </div>
        </div> 
    );
}