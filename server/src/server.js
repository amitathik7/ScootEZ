const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const port = 5000;

const app = express();

// import files
const database = require('./database.js');

// set up cors
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// import and configure environment variables from .env
dotenv.config();
const PORT = process.env.PORT;

// use express JSON
app.use(express.json());
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(process.env.DB_URI);
}

//#endregion ======================================================================

// print out message if the server has been started on port 5000
app.listen(PORT, () => { console.log(`Server Started Port ${PORT}`); });

//#region API calls ================================================================

app.post('/api/users/create', async (req, res) => {
    try {
        const {firstName, lastName, email, password, address, creditCard} = req.body;

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save it to DB, if successful, returns true
        if(await database.CreateAccount({firstName, lastName, email, hashedPassword, address, creditCard})) {
            res.status(201).json({ message: "Account created" });
        }

    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        // get the data from the frontend
        const { email, password } = req.body;

        // First try to find the account in the DB by email
        const account = await database.FindAccount(email);

        // send response if the account is not found
        if (account == null) {
            console.log("The email entered was not found in the DB");
            res.status(401).json({message: "invalid credentials"});
        }
        else {
            // Now check the password
            console.log("Comparing password...");
            if (await bcrypt.compare(password, account.password)) {
                console.log("Password matches, login successful");
                const token = jwt.sign({ id: account._id }, "supposed_to_be_our_secret");
                res.json({ token });
            }
            else {
                console.log("Password does not match, login unsuccessful");
                res.status(401).json({ message: "invalid credentials" });
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

//#endregion =============================================================================
