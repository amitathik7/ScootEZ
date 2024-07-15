const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authenticateToken = require("../middleware/auth");

const port = 5000;

const app = express();

const corsOptions = {
	origin: "*",
	credentials: true,
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

dotenv.config();

app.use(express.json());
if (process.env.NODE_ENV !== "test") {
	mongoose.connect(process.env.DB_URI);
}

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB Connection Error"));

db.once("open", () => {
	console.log("MongoDB Connected");
});

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
	address: String,
});

const adminSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String,
	password: String,
	address: String,
});

const rentalHistorySchema = new mongoose.Schema({
	scooter: {
		type: scooterSchema,
	},
	timeRented: {
		type: Date,
	},
	user: {
		type: accountSchema,
	},
	cost: Number,
	startLatitude: Number,
	startLongitude: Number,
	endLatitude: Number,
	endLongitude: Number,
});

const Account = mongoose.model("account", accountSchema);
const Scooter = mongoose.model("scooter", scooterSchema);
const Employee = mongoose.model("employee", employeeSchema);
const Admin = mongoose.model("admin", adminSchema);
const RentalHistory = mongoose.model("history", rentalHistorySchema);

app.listen(port, () => {
	console.log(`Server Started Port ${port}`);
});

app.post("/api/users/create", async (req, res) => {
	const { firstName, lastName, email, password, address, creditCard } =
		req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const accountDocument = new Account({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
			address: address,
			creditCard: creditCard,
		});

		await accountDocument.save();
		res.status(201);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/api/users/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const account = await Account.findOne({ email: email });

		if (account && (await bcrypt.compare(password, account.password))) {
			console.log("Successful login");
			const token = jwt.sign({ id: account._id }, "secret");
			res.json({ token });
			res.status(201);
		} else {
			console.log("Unsuccessful login");
			res.status(400);
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/scooters", async (req, res) => {
	try {
		const scooters = await Scooter.find({ availability: true });

		res.json({ scooters });
		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

// This is a test function for the token
app.get("/api/users/accountName", authenticateToken, async (req, res) => {
	try {
		const account = await Account.findById(req.user.id);

		if (!account) {
			return res.status(404);
		}

		res.json({ firstName: account.firstName, lastName: account.lastName });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/users/accountInfo", authenticateToken, async (req, res) => {
	try {
		const account = await Account.findById(req.user.id);

		if (!account) {
			return res.status(404);
		}

		res.json({
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			password: account.password,
			address: account.address,
			creditCard: account.creditCard,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.delete("/api/user/delete", authenticateToken, async (req, res) => {
	try {
		const account = await Account.findByIdAndDelete(req.user.id);

		if (!account) {
			return res.status(404);
		}

		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.put("/api/users/update", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;
		const newData = req.body;

		const account = await Account.findByIdAndUpdate(accountId, newData, {
			new: true,
		});

		if (!account) {
			return res.status(404);
		}

		res.json({
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			password: account.password,
			address: account.address,
			creditCard: account.creditCard,
		});
		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = { app };
