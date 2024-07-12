const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const port = 5000;

const app = express();

dotenv.config();

app.use(express.json());
mongoose.connect(process.env.DB_URI);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB Connection Error'));

db.once('open', () => { console.log('MongoDB Connected'); });

const accountSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	address: String,
	creditCard: String,
});

const scooterSchema = new mongoose.Schema({
	latitude: Number,
	longitude: Number,
	battery: Number,
	model: String,
	availability: Boolean,
	rentalPrice: Number,
	id: Number,
});

const employeeSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	address: String
});

const adminSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	address: String
});

const rentalHistorySchema = new mongoose.Schema({
    scooter: {
        type: scooterSchema
    },
    timeRented: {
        type: Date
    },
    user: {
        type: accountSchema
    },
    cost: Number,
    startLatitude: Number,
    startLongitude: Number,
    endLatitude: Number,
    endLongitude: Number
});

const Account = mongoose.model('account', accountSchema);
const Scooter = mongoose.model('scooter', scooterSchema);
const Employee = mongoose.model('employee', employeeSchema);
const Admin = mongoose.model('admin', adminSchema);
const RentalHistory = mongoose.model('history', rentalHistorySchema);

app.listen(port, () => { console.log(`Server Started Port ${port}`); });

app.post('/api/users/create', async (req, res) => {
    const { firstName, lastName, email, password, address, creditCard } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const accountDocument = new Account({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword,
            address: address,
            creditCard: creditCard
        });

        await accountDocument.save();
        res.status(201);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const account = await Account.findOne({ email: email });

        if (user && await bcrypt.compare(password, user.password)) {
            console.log('Successful login');
        } else {
            console.log('Unsuccessful login');
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

// //===============Setup backend API===============
// import express from 'express';  // import express
// import { config } from 'dotenv';
// import { executeCrudOperations } from './databaseCRUD.js';
// const app = express();   // create app
// app.use(express.json());
// app.use(express.urlencoded({extended:true}));


// import cors from 'cors';
// const corsOptions ={
//     origin: ['http://localhost:3000'], 
//     credentials:true,            //access-control-allow-credentials:true
//     methods: ["GET", "POST", "PUT", "DELETE"],
// };
// app.use(cors(corsOptions));

// // get variables from .env into process.env
// config();
// console.log(process.env.DB_URI);

// // call functions for CRUD from database
// //await executeCrudOperations();

// app.post ("/api", async(request, response) => {
//     const {data}=request.body;
//     console.log(data);
// })

// app.get('/api', async (reqest, response) => {
//     try {
//         const { email_input, password_input } = reqest.query;

//         console.log('New login request');

//         console.log(`New login request -> Email: ${email_input}, Password: ${password_input}`);
//     } catch (err) {
//         console.error('Unable to login', err);
//     }
// })

// // startup backend
// app.listen(5000, () => {console.log("Server started on port 5000")})  // server runs on port 5000, client (React) runs on port 3000