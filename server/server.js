const express = require("express");
const mongoose = require("mongoose");

const app = express();

const port = 8383;

const uri =
	"mongodb+srv://TEST_USER:TEST_USER_PASSWORD@testcluster.jopajlh.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster";

app.use(express.static("../public"));
app.use(express.json());

mongoose.connect(uri);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection Error"));
db.once("open", () => {
	console.log("Connected to MongoDB");
});

// const collection = db.collection("accounts");

// async function addAccountDocument(document) {
// 	await collection.insertOne(document);
// }

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

app.post("/users/create", async (req, res) => {
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

app.get("/users/search/:field", async (req, res) => {
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
