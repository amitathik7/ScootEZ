//===============Setup backend API===============
import express from 'express';  // import express
import { config } from 'dotenv';
import { executeCrudOperations } from './databaseCRUD.js';
const app = express();   // create app
app.use(express.json());
app.use(express.urlencoded({extended:true}));


import cors from 'cors';
const corsOptions ={
    origin: ['http://localhost:3000'], 
    credentials:true,            //access-control-allow-credentials:true
    methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

// get variables from .env into process.env
config();
console.log(process.env.DB_URI);

// call functions for CRUD from database
//await executeCrudOperations();

app.post ("/api", async(request, response) => {
    const {data}=request.body;
    console.log(data);
})

app.get('/api', async (reqest, response) => {
    try {
        const { email_input, password_input } = reqest.query;

        console.log('New login request');

        console.log(`New login request -> Email: ${email_input}, Password: ${password_input}`);
    } catch (err) {
        console.error('Unable to login', err);
    }
})

// startup backend
app.listen(5000, () => {console.log("Server started on port 5000")})  // server runs on port 5000, client (React) runs on port 3000

