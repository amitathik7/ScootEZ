import React, { useEffect, useState } from 'react';
import styles from "./styles.css";

import LoginPage from "./Login.js";

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

  // declare variable for what will be displayed
  let pageContent;

  // set the variable for pageContent
  pageContent = < LoginPage />;
  // if (isLoggedIn) {
  //   content = <LoginPage />;
  // } else {
  //   content = <LoginForm />;
  // }

  // What is displayed on the webpage
  return (
    <>
      {/* Nav bar */}
      <nav>
        ScootEZ
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