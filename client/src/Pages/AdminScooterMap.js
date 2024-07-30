import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminScooterMap() {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:5000/api/scooters")
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const scooters = data.scooters;
                if (!Array.isArray(scooters)) {
                    throw new Error('Expected an array of scooters');
                }

                if (!mapRef.current) {
                    const map = L.map(mapContainerRef.current).setView([29.648511, -82.345747], 14);
                    mapRef.current = map;

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; OpenStreetMap contributors'
                    }).addTo(map);

                    const availableScooterIconUrl = 'https://cdn-icons-png.flaticon.com/128/4574/4574375.png';
                    const unavailableScooterIconUrl = 'https://cdn-icons-png.flaticon.com/128/2850/2850638.png';
                    const availableScooterIcon = L.icon({
                        iconUrl: availableScooterIconUrl,
                        iconSize: [64, 64],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });
                    const unavailableScooterIcon = L.icon({
                        iconUrl: unavailableScooterIconUrl,
                        iconSize: [40, 40],
                        iconAnchor: [16, 32],
                        popupAnchor: [0, -32]
                    });

                    scooters.forEach(scooter => {
                        const popupContent = `
                        <div style="width: 190px; height: auto; max-height: 275px; overflow: auto; text-align: center;">
                            <img src="${scooter.availability ? availableScooterIconUrl : unavailableScooterIconUrl}" alt="Scooter Icon" style="width: 80px; height: 80px;"/>
                            <h4 style="margin: 5px;">Scooter ID: ${scooter.id}</h4>
                            <p style="margin: 5px;"><strong>Model:</strong> ${scooter.model}</p>
                            <p style="margin: 5px;"><strong>Location:</strong> ${scooter.latitude}, ${scooter.longitude}</p>
                            <p style="margin: 5px;"><a href="http://localhost:3000/admin/scooters/${scooter.id}" style="text-decoration: none; color: blue;">Edit Details</a></p>
                        </div>
                        `;

                        const scooterIcon = scooter.availability ? availableScooterIcon : unavailableScooterIcon;

                        L.marker([scooter.latitude, scooter.longitude], { icon: scooterIcon })
                            .addTo(map)
                            .bindPopup(popupContent);
                    });
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
            });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    return <div ref={mapContainerRef} id="map" style={{ height: '100vh' }} />;
}
