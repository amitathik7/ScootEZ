import React, { useEffect, useState } from 'react';
import styles from "./styles.css";
import { Routes, Route} from 'react-router-dom';

import HomePage from "./Pages/HomePage.js";
import ErrorPage from "./Pages/RouterErrorPage.js";
import LoginPage from "./Pages/LoginPage.js";
import CreateAccountPage from './Pages/CreateAccountPage.js';
import ScooterProductPage from './Pages/ScooterProductPage.js'
import ScooterPage from './Pages/ScooterPage.js';

import NavBar from "./NavBar.js";
import Footer from "./Footer.js";

function App() {

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
      <NavBar />
      <div className="navBarBuffer" />

      <body>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/create-account" element={<CreateAccountPage/>} />
          <Route path="/scooter">
            <Route index element={<ScooterPage/>} />
            <Route path=":id" element={<ScooterProductPage/>} />
          </Route>
          <Route path="*" element={<ErrorPage />} />
        </Routes>

        <Footer />

      </body>
    </div>
  );
}

export default App