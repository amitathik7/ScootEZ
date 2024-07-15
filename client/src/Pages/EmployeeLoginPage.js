import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmployeeLoginPage() {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    });

    const handleEmailChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            email: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setLoginInfo({
            ...loginInfo,
            password: e.target.value
        });
    };

    const navigate = useNavigate();

    const handleLogin = async () => {
        console.log(loginInfo);

        try {
            const response = await fetch(
                `http://localhost:5000/api/employee-login`, 
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginInfo),
                }
            );

            if (response.ok) {
                // Successful login
                navigate('/employee-dashboard'); 
            } else {
                // Handle failed login 
                console.error('Login failed');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin: "0px", paddingTop: "150px", paddingBottom: "150px" }}>
            <div style={{ width: "60%", display: "inline-block", lineHeight: "40px" }}>
                <h1>Employee Login</h1>
                <p>Email:</p>
                <input className="input1"
                    value={loginInfo.email}
                    onChange={handleEmailChange}
                 />
                <p>Password:</p>
                <input className="input1"
                    type="password"
                    value={loginInfo.password}
                    onChange={handlePasswordChange}
                />
                <button className="button1" onClick={handleLogin}>
                        LOGIN
                </button>
            </div>
        </div>
    );
}