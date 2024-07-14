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

import NavBar from "./NavBar.js";
import Footer from "./Footer.js";

export const AccountContext = React.createContext(null);
export const IsLoggedInContext = React.createContext(false);

function App() {
  const [account, setAccount] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // create state variables
  //const [backendData, setBackendData] = useState([{}])

  // use effect to fetch the api (since proxy is defined in package.json, can refer to it as "/api")
  // after getting response, set the variable backendData to whatever the fetch recieves in response.json
  // pass in empty array at the end of useEffect so the effect block only runs on the first render of the component
  // useEffect(() => {
  //   fetch("/api").then(
  //     response => response.json()
  //   ).then(
  //     data => {
  //       setBackendData(data)
  //     }
  //   )
  // }, [])

  // What is displayed on the webpage
  return (
    <div className="App">
      <AccountContext.Provider value={{ account: account, setAccount: setAccount }}>
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
            <Route path="*" element={<ErrorPage />} />
          </Routes>

          <Footer />

        </body>
      </IsLoggedInContext.Provider>
      </AccountContext.Provider>
    </div>
  );
}

export default App