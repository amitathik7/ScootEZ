import "leaflet/dist/leaflet.css"; // for tile styling and avoiding glitching tiles
import L from 'leaflet'; // for map initialization and use
import React, { useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminMapPage() {
    const mapContainerRef = useRef(null); // Useref for the map container
    const mapRef = useRef(null); // Useref to store the map instance
    const navigate = useNavigate();

    function AdminMapCode()
    {
        useEffect(() => {
            // accesss api endpoint in backend which retrieves scooter data from our database
            fetch("http://localhost:5000/api/scooters")
            // once the response has been received, check that it is ok then pass it on to the next '.then'
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            // store the response in a variable called 'data'
            .then(data => {
                // since data is a json, we need to access the array of scooters
                const scooters = data.scooters;
                // print the scooters to confirm successful data
                console.log("scooters response: ", scooters);            
                 // confirm the scooters variable is an array
                if (!Array.isArray(scooters)) {
                    throw new Error('Expected an array of scooters');
                }

                // initialize the map only if it has not been already initialized
                if (!mapRef.current) {  
                    // create map
                    const map = L.map(mapContainerRef.current).setView([29.648511, -82.345747], 14);
                    mapRef.current = map; // Store the map instance in the ref
                    
                    // Set up the tile layer
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);

                    // create a custom icon for the scooter markers
                    const availableScooterIconUrl = 'https://cdn-icons-png.flaticon.com/128/4574/4574375.png'; 
                    const unavailableScooterIconUrl = 'https://cdn-icons-png.flaticon.com/128/2850/2850638.png';
                    const availableScooterIcon = L.icon({
                        iconUrl: availableScooterIconUrl,
                        iconSize: [64, 64],       // Size of the icon
                        iconAnchor: [16, 32],     // Anchor point
                        popupAnchor: [0, -32]     // Popup anchor
                    });
                    const unavailableScooterIcon = L.icon({
                        iconUrl: unavailableScooterIconUrl,
                        iconSize: [40, 40],       // Size of the icon
                        iconAnchor: [16, 32],     // Anchor point
                        popupAnchor: [0, -32]     // Popup anchor
                    });


                    // add the scooter markers to the map
                    scooters.forEach(scooter => {
                        const popupContent = `
                        <div style="width: 190px; height: auto; max-height: 275px; overflow: auto; text-align: center;">
                            <img src="${scooter.availability ? availableScooterIconUrl : unavailableScooterIconUrl}" alt="Scooter Icon" style="width: 80px; height: 80px;"/>
                            <h4 style="margin: 5px;">Scooter ID: ${scooter.id}</h4>
                            <p style="margin: 5px;"><strong>Model:</strong> ${scooter.model}</p>
                            <p style="margin: 5px;"><strong>Location:</strong> ${scooter.latitude}, ${scooter.longitude}</p>
                            <p style="margin: 5px;">
                                <a href="#" onclick="window.handleEditClick(${scooter.id}); return false;" style="text-decoration: none; color: blue;">
                                    Edit Details
                                </a>
                            </p>
                        </div>
                        `;

                         // Choose icon based on availability
                        const scooterIcon = scooter.availability ? availableScooterIcon : unavailableScooterIcon;

                        L.marker([scooter.latitude, scooter.longitude], { icon: scooterIcon})
                        .addTo(map)
                        .bindPopup(popupContent);
                    });

                    window.handleEditClick = (scooterId) => {
                        navigate(`/admin/scooters/${scooterId}`);
                    };
                    
                }
            
                // Clean up the map instance when the component unmounts
                return () => {
                    if (mapRef.current) {
                    mapRef.current.remove();
                    mapRef.current = null;
                    }
                };
            })
            // throw error if something doesn't work
            .catch(error => {
              console.error('Fetch error:', error);
            });
          }, []);
        
          return <div ref={mapContainerRef} id="admin/map"></div>;
    }

    return(
        <div id = 'admin/map'>
            <AdminMapCode />
        </div>
    );
}