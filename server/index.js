const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const port = 5000;
const app = express();

// There was some problem with cross-communication with different ports
// This stack overflow thread had this solution https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const uri =
	"mongodb+srv://TEST_USER:TEST_USER_PASSWORD@testcluster.jopajlh.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster";

app.use(express.json());
app.use(express.static(path.join(__dirname, "../client"))); // Making sure we can send the static files to the right folder.

mongoose.connect(uri);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));

db.once("open", () => {
	console.log("Connected to MongoDB");
});

// Making an object that has the same structure as the data I have saved on MongoDB
const account_schema = new mongoose.Schema({
	firstName: String,
    lastName: String,
    email: String,
    password: String,
    address: String,
    creditCard: String
});

const account = mongoose.model("account", account_schema);

// Function that we can use in app.js to get the data from the MongoDB database
app.get("/api/users", async (req, res) => {
	// console.log('GET /api/users');
	try {
		const accounts = await account.find({
			firstName: { $exists: true },
			lastName: { $exists: true },
			email: { $exists: true },
			password: { $exists: true },
		});
		res.json(accounts);
	} catch (err) {
		res.status(500).send(err);
	}
});

// Function to check for a specific user
app.get("/api/check", async (req, res) => {
	const { firstName, lastName } = req.query;

	console.log(`New Search with names: ${firstName}, ${lastName}`);

	try {
		const accounts = await account.find({
			firstName: { $exists: true, $ne: null },
			lastName: { $exists: true, $ne: null },
			...(firstName && { firstName: firstName }),
			...(lastName && { lastName: lastName }),
		});

		res.json(accounts);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Function to add a new user account
app.post('/api/users', async (req, res) => {
    console.log('New Account Request');
    const { firstName, lastName, email, password, address, creditCard } = req.body;

    console.log(firstName, lastName, email, password, address, creditCard);

    try {
        const newAccount = new account({
            firstName,
            lastName,
            email,
            password,
            address,
            creditCard
        })
 
        await newAccount.save();
        res.status(201).json(newUser);
        return;
    } catch (error) {
        res.json(500).send(error);
        return;
    }
});

app.listen(port, () => {
	console.log("Server start on port %s", port);
});
