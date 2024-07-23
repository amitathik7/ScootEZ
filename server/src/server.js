const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const authenticateToken = require("../middleware/auth");

const port = 5000;
const app = express();

// set up Cors
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

// connect to MongoDB
const db = mongoose.connection;

// check connection to mongoDB
db.on("error", console.error.bind(console, "MongoDB Connection Error"));
db.once("open", () => {
	console.log("MongoDB Connected");
});

// initialize MongoDB Schemas (JSON object that defines the structure and contents of the data)
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

// Initialize MongoDB collections (using mongoose.model)
const Account = mongoose.model("account", accountSchema);
const Scooter = mongoose.model("scooter", scooterSchema);
const Employee = mongoose.model("employee", employeeSchema);
const Admin = mongoose.model("admin", adminSchema);
const RentalHistory = mongoose.model("history", rentalHistorySchema);

// log if server started on port 5000
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

		// save the new account to DB
		await accountDocument.save();

		// get that new account's id
		const account = await Account.findOne({ email: email });

		// make new token and send it back to frontend
		const token = jwt.sign({ id: account._id }, "secret");
		res.status(201).json({ token });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.post("/api/users/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		console.log("email recieved: " + email);
		console.log("finding...");
		const account = await Account.findOne({ email: email });
		console.log(account);
		console.log("comparing...");
		if (account && (await bcrypt.compare(password, account.password))) {
			console.log("Successful login");
			const token = jwt.sign({ id: account._id }, "secret");
			res.json({ token });
			res.status(201);
		} else {
			console.log("Unsuccessful login");
			res.status(400).json({ message: "invalid credentials" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

// Gets the location of all scooters for the user's map.
app.get("/api/scooters", async (req, res) => {
	try {
		const scooters = await Scooter.find();

		res.json({ scooters });
		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Returns the user's full name for the navbar.
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

// This is a test function for the token
app.get("/api/token/verify", authenticateToken, async (req, res) => {
	try {
		console.log("Searching for account...");
		const account = await Account.findById(req.user.id);

		if (!account) {
			console.log("Account not found.");
			return res.status(404).json({ message: false });
		} else {
			console.log("Account found.");
			return res.status(200).json({ message: true });
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

// Returns all the rental history for a user based on the token.
app.get("/api/history", authenticateToken, async (req, res) => {
	try {
		const account = await Account.findById(req.user.id);

		if (!account) {
			return res.status(404).send("Invalid token");
		}

		const histories = await RentalHistory.find({ user: account });

		res.json({ histories });
		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/employee/scooters", authenticateToken, async (req, res) => {
	try {
		const employee = await Employee.findById(req.user.id);
		const admin = await Admin.findById(req.user.id);

		if (!admin && !employee) {
			return res.status(404).send("Invalid Token");
		}

		const scooters = await Scooter.find();

		res.json(scooters);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/api/admin/create_employee", authenticateToken, async (req, res) => {
	const { firstName, lastName, email, password, address } = req.body;

	try {
		const admin = await Admin.findById(req.user.id);

		if (!admin) {
			return res.status(404).json({ message: "Invalid Admin Credentials" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const employeeDocument = new Employee({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
			address: address,
		});

		await employeeDocument.save();

		const employee = await Employee.findOne({
			firstName: firstName,
			lastName: lastName,
			email: email,
			address: address,
		});

		const token = jwt.sign({ id: employee._id }, "secret");
		res.status(201).json({ token });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/api/employee/login", async (req, res) => {
	const { email, password } = req.body;

	try {
		const employee = await Employee.findOne({ email: email });

		if (employee && (await bcrypt.compare(password, employee.password))) {
			const token = jwt.sign({ id: employee._id }, "secret");
			res.json({ token });
			res.status(201);
		} else {
			res.status(400).json({ message: "Invalid Employee Credentials" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

module.exports = { app };
