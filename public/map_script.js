// Initialize the map
var map = L.map('map').setView([29.648511, -82.345747], 16); // Centered on the Hub
const baseUrl = "http://localhost:8383/";

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Fetch scooter locations from backend API which is using a hardcoded list of scooters for now
fetch(baseUrl + 'api/scooters')
    .then(response => response.json())
    .then(data => {
        data.forEach(scooter => {
            L.marker([scooter.lat, scooter.lng]).addTo(map)
                .bindPopup(`Scooter ID: ${scooter.id}`);
                // .openPopup(); this opens up the last scooter in the list but I don't really like it
        });
    })
    .catch(error => console.error('Error fetching scooter data:', error));