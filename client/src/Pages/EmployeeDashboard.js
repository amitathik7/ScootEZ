import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; 

export default function EmployeeDashboard() {
    return (
        <div className="dashboardContainer">
            <div className="welcomeMessage">
                <h1>Thanks for working for ScootEZ!</h1>
                <p className="subtext">Please reach out to an administrator with any questions.</p>
            </div>
            <div className="imageGallery">
                <img src="https://getweeklyupdate.com/blog/wp-content/uploads/2018/02/1.jpg" alt="Team" className="dashboardImage" />
                <img src="https://cdn.olaelectric.com/sites/evdp/pages/futurefactory/ff_expansion_production_web.webp" alt="Scooter" className="dashboardImage" />
                <img src="https://media.licdn.com/dms/image/D4E12AQG_g-IOlh6jrw/article-cover_image-shrink_720_1280/0/1659389274730?e=2147483647&v=beta&t=fpDCNESK4-ea_TSPWPhj2YktQm5E0gqMSl-LAMjPqWA" alt="Work Environment" className="dashboardImage" />
            </div>
        </div>
    );
}