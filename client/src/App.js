import React, { useEffect, useState } from 'react';
import styles from "./styles.css";
import { Routes, Route} from 'react-router-dom';

import HomePage from "./Pages/HomePage.js";
import ErrorPage from "./Pages/RouterErrorPage.js";
import LoginPage from "./Pages/LoginPage.js";
import CreateAccountPage from './Pages/CreateAccountPage.js';
import AboutPage from './Pages/AboutPage.js';
import MapPage from './Pages/MapPage.js';
import FaqPage from './Pages/FaqPage.js';
import ScooterProductPage from './Pages/ScooterProductPage.js'
import ScooterPage from './Pages/ScooterPage.js';
import RentPage from './Pages/RentPage.js';
import ProfilePage from './Pages/ProfilePage.js';
import CurrentRentalsPage from './Pages/CurrentRentalsPage.js';
import RentalHistoryPage from './Pages/RentalHistoryPage.js';
import EmployeeLoginPage from './Pages/EmployeeLoginPage.js';
import AdminLoginPage from './Pages/AdminLoginPage.js';
import AdminDashboard from './Pages/AdminDashboard.js';

import NavBar from "./NavBar.js";
import AdminNavBar from "./AdminNavBar.js";
import Footer from "./Footer.js";

export const IsLoggedInContext = React.createContext(false);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="App">
      <IsLoggedInContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn, isAdmin: isAdmin, setIsAdmin: setIsAdmin }}>
        {isAdmin ? <AdminNavBar /> : <NavBar />}
        <div className="navBarBuffer" />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />}/>
            <Route path="/about" element={<AboutPage/>} />
            <Route path="/map" element={<MapPage/>} />
            <Route path="/faq" element={<FaqPage/>} />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/create-account" element={<CreateAccountPage/>} />
            <Route path="/scooters">
              <Route index element={<ScooterPage/>} />
              <Route path=":id" element={<ScooterProductPage/>} />
            </Route>
            <Route path="/rent/:id" element={<RentPage/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/current-rentals" element={<CurrentRentalsPage/>} />
            <Route path="/rental-history" element={<RentalHistoryPage/>} />
            <Route path="/employee-login" element={<EmployeeLoginPage/>} />
            <Route path="/admin-login" element={<AdminLoginPage/>} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>
        {!isAdmin && <Footer />}
      </IsLoggedInContext.Provider>
    </div>
  );
}

export default App