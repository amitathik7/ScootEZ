const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const app = express();

const port = 8383;

const uri =
	"mongodb+srv://TEST_USER:TEST_USER_PASSWORD@testcluster.jopajlh.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster";

app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());

mongoose.connect(uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
	console.log("Connected to MongoDB");
});

const accountSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	address: String,
	creditCard: String,
});

const Account = mongoose.model("account", accountSchema);

/* CRUD Operations */

app.post("/api/users/create", async (req, res) => {
	const { firstName, lastName, email, password, address, creditCard } =
		req.body;

	console.log(
		"New Account Request: ",
		firstName,
		lastName,
		email,
		password,
		address,
		creditCard
	);

	const accountDocument = new Account({
		firstName: firstName,
		lastName: lastName,
		email: email,
		password: password,
		address: address,
		creditCard: creditCard,
	});

	try {
		await accountDocument.save();
		res.status(201).json(accountDocument);
	} catch (err) {
		res.status(500).send(err);
	}

	// addAccountDocument(accountDocument);
});

app.get("/api/users/search/:field", async (req, res) => {
	const { field } = req.params;

	if (field === "name") {
		const { firstName_input, lastName_input } = req.query;
		console.log(`Search by name: ${firstName_input}, ${lastName_input}`);

		const searchResults = await Account.find({
			firstName: firstName_input,
			lastName: lastName_input,
		});
		res.json(searchResults);
	} else if (field === "email") {
		const { email_input } = req.query;
		console.log(`search by email: ${email_input}`);

		const searchResults = await Account.find({ email: email_input });
		res.json(searchResults);
	}

	res.status(200);
});

const tempScooters = [
	{ id: 1, lat: 29.64993459, lng: -82.349},
	{ id: 2, lat: 29.64885678, lng: -82.342234242},
	{ id: 3, lat: 29.64712367, lng: -82.343234233},
];

app.get("/api/scooters", async (req, res) => {
	res.json(tempScooters);
});

// app.get("/info/:dynamic", (req, res) => {
// 	const { dynamic } = req.params;
// 	const { key } = req.query;
// 	console.log(dynamic, key);
// 	res.status(200).json({ info: "Preset Text :D" });
// });

// app.post("/", (req, res) => {
// 	const { parcel } = req.body;
// 	console.log(parcel);
// 	if (parcel == "") {
// 		return res.status(400).send({ status: "failed" });
// 	}
// 	res.status(200).send({ status: "recieved" });
// });

app.listen(port, () => console.log(`Server has started on port ${port}`));
