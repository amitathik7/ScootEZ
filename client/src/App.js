import React, { useEffect, useState } from 'react'

function App() {

  // create a state variable
  const [backendData, setBackendData] = useState([{}])

  // use effect to fetch the api (since proxy is defined in package.json, can refer to it as "/api")
  // after getting response, set the variable backendData to whatever the fetch recieves in response.json
  // pass in empty array at the end of useEffect so the effect block only runs on the first render of the component
  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])

  // What is displayed on the webpage
  return (
    // display the data stored in backendData
    // if 'undefined', display "Loading..."
    // else, map the data to a HTTP paragraph tag <p>
    <div>
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ): (
        backendData.users.map((user, i) => (
          <p key={i}>{user}</p>
        ))
      )}
    </div>
  )
}

export default App