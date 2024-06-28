//===============Setup backend API===============
import express from 'express';  // import express
import { config } from 'dotenv';
import { executeCrudOperations } from './databaseCRUD.js';
const app = express()   // create app

// get variables from .env into process.env
config();
console.log(process.env.DB_URI);

// call functions for CRUD from database
await executeCrudOperations();

// setup route for api
app.get("/api", (request, response) => {
    response.json({"users": ["user1, user2, user3"]})   // "users" is a JSON array of users
})

// startup backend
app.listen(5000, () => {console.log("Server started on port 5000")})  // server runs on port 5000, client (React) runs on port 3000

