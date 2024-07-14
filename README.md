# ScootEZ

## Project Information
ScootEZ is a software engineering project for the course CEN3031 Introduction to Software Engineering, summer 2024.

In response to the challenge of designing a tracking system for an electric scooter rental service, this is a web application connected to a server using the react.JS and Node.JS frameworks. The application is able to create three different types of accounts, customer, employee, and administrator, which will have their appropriate functionalities according to the client’s requirements. It stores the scooter information and account information in a local database.

Development Team
* Jaidyn Holt: Scrum Master
* Amit Athi Kesavan: Product Manager
* Annabel Stocks Natalias: Development Team Member
* Elan Bar-Nur: Development Team Member

## Product Vision
For Gainesville residents and UF commuters who need to get around quickly but are unable to easily have their own means of transportation, ScootEZ is a scooter rental service application that is effective and easy and has a user-friendly interface. Unlike our competitor Bird Scooters, our product offers online platform capability with a sleek and easy user design at a low cost.

## Documentation

### Setup


Set up server side:
* install __node.js__ and __npm__ (can confirm you have them with ```node -v``` and ```npm -v```)
* create directory __server__ and go into it ```cd server```
* ```npm install express``` This installs __express__ and generates __node_modules__ and __package.json__ files
* ```npm install nodemon -D``` This installs __nodemon__ which helps develop __Node.js__ based applications by automatically restarting the __node__ application when file changes in the directory are detected. ```-D``` indicates dev dependency.
* go into __package.json__ and add ```"start": "node server"``` and ```"dev": "nodemon server"``` under ```"scripts"```

Set up client side:
* create directory __client__ and go into it ```cd client```
* create React project here ```npx create-react-app .``` where the ```.``` indicates creating it in this __client__ directory
* add ```"proxy": "http://localhost:5000"``` to the __package.json__ file in __client__ directory. This allows us to make relative api requests and avoid issues with cross origin.
* ```npm install --save react-router-dom``` This is a router that allows switching between multiple web (html) pages.

### Dev Commands
__Backend (runs on localhost:5000):__ Inside the __server__ directory, you can run several commands:
* ```npm run dev``` Starts the development server with nodemon (use this for development)

__Frontend (runs on localhost:3000):__ Inside the __client__ directory, you can run several commands:
* ```npm start``` Starts the frontend React app server; you must start the backend before starting the frontend so the frontend can fetch the backend

Other npm commands that can be run on frontend and backend:
* ```npm run build``` Bundles the app into static files for production.
* ```npm test``` Starts the test runner
* ```npm run eject``` Removes this tool and copies build dependencies, configuration files and scripts into the app directory. If you do this, you can’t go back!

### External Resources and References
* <a href="https://youtu.be/w3vs4a03y3I?feature=shared" target="_blank">VIDEO: Resource for setting up Node, React, Express</a>
* <a href="https://youtu.be/bhiEJW5poHU?feature=shared" target="_blank">VIDEO: Resource for setting up MongoDB and connecting it to Node.js app</a>
* <a href="https://www.mongodb.com/resources/languages/mongodb-and-npm-tutorial" target="_blank">DOCUMENT: Connect MongoDB and CRUD operations</a>
* <a href="https://youtu.be/KZB6gtKQ9_I?feature=shared" target="_blank">VIDEO: Send data from frontend to backend and store in DB</a>
* <a href="https://youtu.be/Ul3y1LXxzdU?feature=shared" target="_blank">VIDEO: Using react-router-dom</a>
