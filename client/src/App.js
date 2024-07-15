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
import ProfilePage from './Pages/ProfilePage.js';
import CurrentRentalsPage from './Pages/CurrentRentalsPage.js';
import EmployeeLoginPage from './Pages/EmployeeLoginPage.js';
import AdminLoginPage from './Pages/AdminLoginPage.js';

import NavBar from "./NavBar.js";
import Footer from "./Footer.js";

export const IsLoggedInContext = React.createContext(false);

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="App">
      <IsLoggedInContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn }}>
        <NavBar />
        <div className="navBarBuffer" />

        <body>
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
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/current-rentals" element={<CurrentRentalsPage/>} />
            <Route path="/employee-login" element={<EmployeeLoginPage/>} />
            <Route path="/admin-login" element={<AdminLoginPage/>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </body>
        <Footer />
      </IsLoggedInContext.Provider>
    </div>
  );
}

export default App