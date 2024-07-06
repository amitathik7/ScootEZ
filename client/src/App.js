import React, { useEffect, useState } from 'react';
import styles from "./styles.css";

import HomePage from "./Home.js";
import LoginPage from "./Login.js";

function App() {
  // The display case for the screen
  // 0=home
  // 1=LoginPage (create account)
  // 2=LoginPage (login)
  const [displayCase, setDisplayCase] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function CreateAccountButton() {
    function handleClick() {
      setDisplayCase(1);
    }
    return (
      <button className="button1" onClick={handleClick}>
          Create Account
      </button>
    );
  }

  function LoginButton() {
    function handleClick() {
      setDisplayCase(2);
    }
    return (
      <button className="button4" onClick={handleClick}>
          Login
      </button>
    );
  }

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



  // declare variable for what will be displayed
  let pageContent;

  // set the variable for pageContent
  if (displayCase == 1) {
    pageContent = null;
    pageContent = <LoginPage  displayStartCase={0}/>;
  }
  else if (displayCase == 2) {
    pageContent = null;
    pageContent = <LoginPage  displayStartCase={1}/>;
  }
  else {
    pageContent = <HomePage/>;
  }

  // What is displayed on the webpage
  return (
    <>
      {/* Nav bar */}
      <nav>
        <span style={{float: "left"}}>ScootEZ</span>
        <span style={{float: "right"}}> <CreateAccountButton/> </span>
        <span style={{float: "right"}}> <LoginButton/> </span>
      </nav>
      <body>
        {pageContent}
        {/* // display the data stored in backendData
        // if 'undefined', display "Loading..."
        // else, map the data to a HTTP paragraph tag <p> */}
        {/* <div>
          {(typeof backendData.users === 'undefined') ?
          (
            <p>Loading...</p>
          ):
          (
            backendData.users.map((user, i) => (
              <p key={i}>{user}</p>
            ))
          )}
        </div> */}
      </body>
    </>
  );
}

export default App