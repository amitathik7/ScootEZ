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

// for reading csv files
const fs = require("fs");
const readline = require("readline");

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
	creditCardNumber: String,
	creditCardExpirationDate: String,
	creditCardCVV: String,
});

const scooterSchema = new mongoose.Schema({
	latitude: Number,
	longitude: Number,
	battery: Number,
	model: String,
	availability: Boolean,
	rentalPrice: Number,
	id: Number,
	waitTimeMinutes: Number,
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
	rental_start: {
		type: Date,
	},
	rental_end: {
		type: Date,
	},
	account: {
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

async function generateUsers() {
	// specify the path of the CSV file
	const path = "src/Popular_Baby_Names.csv";

	// Create a read stream
	const readStream = fs.createReadStream(path);

	// Create a readline interface
	const readInterface = readline.createInterface({
		input: readStream,
	});

	// Initialize an array to store the parsed data
	const output = [];

	// Event handler for reading lines
	readInterface.on("line", (line) => {
		const row = line.split(",");
		output.push(row);
	});

	// Event handler for the end of file
	readInterface.on("close", () => {
		//generate random users
		for (let i = 2950; i < 3000; i++) {
			try {
				bcrypt
					.hash(
						output[i][3].toUpperCase() + output[i][3].toLowerCase() + "11",
						10
					)
					.then((result) => {
						const accountDocument = new Account({
							firstName: output[i][3].toLowerCase(),
							lastName:
								output[Math.trunc(Math.random() * 100) + 100][3].toLowerCase(),
							email: output[i][3].toLowerCase() + "@mail.com",
							password: result,
						});
						console.log(accountDocument);

						// save the new account to DB
						accountDocument.save();
					});
			} catch (err) {
				console.log(err);
			}
		}
	});

	// Event handler for handling errors
	readInterface.on("error", (err) => {
		console.error("Error reading the CSV file:", err);
	});
}

app.post("/api/users/create", async (req, res) => {
	const {
		firstName,
		lastName,
		email,
		password,
		address,
		creditCardNumber,
		creditCardExpirationDate,
		creditCardCVV,
	} = req.body;

	try {
		const hashedPassword = await bcrypt.hash(password, 10);

		const accountDocument = new Account({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
			address: address,
			creditCardNumber: creditCardNumber,
			creditCardExpirationDate: creditCardExpirationDate,
			creditCardCVV: creditCardCVV,
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
			creditCardNumber: account.creditCardNumber,
			creditCardExpirationDate: account.creditCardExpirationDate,
			creditCardCVV: account.creditCardCVV,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/users", authenticateToken, async (req, res) => {
	try {
		const admin = await Admin.findById(req.user.id);
		const employee = await Employee.findById(req.user.id);

		if (!admin && !employee) {
			return res.status(403).send("Access denied.");
		}

		const accounts = await Account.find();
		res.status(200).json(accounts);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.delete("/api/users/delete", authenticateToken, async (req, res) => {
	try {
		const account = await Account.findByIdAndDelete(req.user.id);

		if (!account) {
			console.log("account not found");
			return res.status(404).json({ message: "account not found" });
		}

		console.log("account deleted");
		res.status(200).json({ message: "successfully deleted" });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.delete("/api/employee/delete", authenticateToken, async (req, res) => {
	try {
		const account = await Employee.findByIdAndDelete(req.user.id);

		if (!account) {
			console.log("account not found");
			return res.status(404).json({ message: "account not found" });
		}

		console.log("account deleted");
		res.status(200).json({ message: "successfully deleted" });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.put("/api/users/update", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;
		const newData = req.body;

		if (newData.password) {
			newData.password = await bcrypt.hash(newData.password, 10);
		}

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
			creditCardNumber: account.creditCardNumber,
			creditCardExpirationDate: account.creditCardExpirationDate,
			creditCardCVV: account.creditCardCVV,
		});
		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/api/users/check_password", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;

		const input_password = req.body;

		const account = await Account.findById(accountId);

		if (
			account &&
			(await bcrypt.compare(input_password.oldPassword, account.password))
		) {
			res.json(true);
			res.status(201);
		} else {
			res.json(false);
			res.status(400);
		}
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.post("/api/users/rent_scooter", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;
		const scooterData = req.body;
		console.log(req.body);

		const account = await Account.findById(accountId);
		const scooter = await Scooter.findById(scooterData.scooterId);

		if (!account) {
			throw new Error("Invalid Account Token");
		}

		if (!scooter) {
			throw new Error("Invalid Scooter ID");
		}

		if (scooter.availability === false) {
			throw new Error("Scooter Unavailable");
		}

		// first update the scooter itself (availability and wait time)
		scooter.availability = false;
		scooter.waitTimeMinutes = scooterData.timeDifference;
		await scooter.save();

		// Create a new scooter rental history fwithout defining the final coordinates
		const scooter_document = new RentalHistory({
			scooter: scooter,
			rental_start: Date.now(),
			cost: (scooterData.timeDifference / 60.0) * scooter.rentalPrice,
			account: account,
			startLatitude: scooter.latitude,
			startLongitude: scooter.longitude,
		});
		await scooter_document.save();

		res.status(201).json("Successful Transaction");
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.post("/api/users/end_rental", authenticateToken, async (req, res) => {
	try {
		console.log(req.body);
		const accountId = req.user.id;
		const { scooterId, latitude, longitude } = req.body;

		// get the account (to search for the history)
		const account = await Account.findById(accountId);
		if (!account) {
			console.log("Invalid Account Token");
			throw new Error("Invalid Account Token");
		}

		// get and update the scooter
		const scooter = await Scooter.findById(scooterId);
		if (!scooter) {
			console.log("Invalid Scooter ID");
			throw new Error("Invalid Scooter ID");
		}

		// get the old history
		const oldHistory = await RentalHistory.findOne({
			account: account,
			scooter: scooter,
			rental_end: { $exists: false },
		});
		if (!oldHistory) {
			console.log("Couldn't find history");
			throw new Error("Couldn't find history");
		}

		// get and update the history
		const updatedHistory = await RentalHistory.findOneAndUpdate(
			{ account: account, scooter: scooter, rental_end: { $exists: false } },
			{
				$set: {
					endLatitude: latitude,
					endLongitude: longitude,
					rental_end: Date.now(),
					cost:
						((Date.now() - new Date(oldHistory.rental_start).getTime()) /
							(60 * 60 * 1000)) *
						scooter.rentalPrice,
				},
			},
			{ new: true }
		);

		// update the scooter
		await Scooter.findByIdAndUpdate(
			scooterId,
			{
				$set: {
					latitude: latitude,
					longitude: longitude,
					availability: true,
					waitTimeMinutes: 0,
				},
			},
			{ new: true }
		);

		res.status(201).json(updatedHistory);
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.get(
	"/api/users/get_ongoing_rentals",
	authenticateToken,
	async (req, res) => {
		try {
			const accountId = req.user.id;

			const account = await Account.findById(accountId);

			if (!account) {
				throw new Error("Invalid Account Token");
			}

			const ongoing_rentals = await RentalHistory.find({
				account: account,
				rental_end: { $exists: false },
			});
			res.json(ongoing_rentals);
			res.status(200);
		} catch (err) {
			res.status(500).send(err);
		}
	}
);

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

app.put("/api/scooters/update", authenticateToken, async (req, res) => {
	try {
		console.log("Request received to update scooter:", req.body);

		// const admin = await Admin.findById(req.user.id);

		// if (!admin) {
		// 	console.log("Invalid admin token");
		// 	throw new Error("Invalid Admin Token");
		// }

		const admin = await Admin.findById(req.user.id);
		const employee = await Employee.findById(req.user.id);

		if (!admin && !employee) {
			return res.status(403).send("Access denied.");
		}

		const { scooter_id, newData } = req.body;
		console.log("scooter_id:", scooter_id);
		console.log("newData:", newData);
		//const scooterIdStr = scooter_id.toString();

		const scooter = await Scooter.findByIdAndUpdate(scooter_id, newData, {
			new: true,
		});

		if (!scooter) {
			console.log("Scooter not found");
			return res.status(404);
		}

		// res.json({
		// 	latitude: Number,
		// 	longitude: Number,
		// 	battery: Number,
		// 	model: String,
		// 	availability: Boolean,
		// 	rentalPrice: Number,
		// 	id: Number,
		// });
		res.json(scooter);
		console.log("Scooter updated successfully:", scooter);
		//return res.status(200);
	} catch (err) {
		console.error("Error updating scooter:", err);
		return res.status(500).json({ error: err.message });
	}
});

app.post("/api/scooters/find", async (req, res) => {
	const { scooterId } = req.body;

	try {
		console.log("scooter id recieved: " + scooterId);
		console.log("finding...");
		const scooter = await Scooter.findOne({ id: scooterId });
		console.log(scooter);
		if (scooter) {
			console.log("returning the scooter...");
			res.json(scooter);
			res.status(201);
		} else {
			console.log("Unsuccessful");
			res.status(400).json({ message: "Could not find scooter by id" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

// This authenticates the token (FOR USERS)
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

// This authenticates the token (FOR ADMIN)
app.get("/api/token/verify/admin", authenticateToken, async (req, res) => {
	try {
		console.log("Searching for account...");
		const account = await Admin.findById(req.user.id);

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

// This authenticates the token (FOR EMPLOYEES)
app.get("/api/token/verify/employee", authenticateToken, async (req, res) => {
	try {
		console.log("Searching for account...");
		const account = await Employee.findById(req.user.id);

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

		const histories = await RentalHistory.find({
			account: account,
			rental_end: { $exists: true },
		});

		res.json(histories);
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

app.get("/api/employees", authenticateToken, async (req, res) => {
	try {
		const admin = await Admin.findById(req.user.id);

		if (!admin) {
			return res.status(403).send("Access denied.");
		}

		const accounts = await Employee.find();
		res.status(200).json(accounts);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/employee/user_accounts", authenticateToken, async (req, res) => {
	try {
		const employee = await Employee.findById(req.user.id);
		const admin = await Admin.findById(req.user.id);

		if (!admin && !employee) {
			return res.status(404).send("Invalid Token");
		}

		const accounts = await Account.find();
		res.json(accounts);
	} catch (error) {
		return res.status(500).send(error);
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

app.get("/api/employee/accountInfo", authenticateToken, async (req, res) => {
	try {
		const employee = await Employee.findById(req.user.id);

		if (!employee) {
			return res.status(404);
		}

		res.json({
			firstName: employee.firstName,
			lastName: employee.lastName,
			email: employee.email,
			password: employee.password,
			address: employee.address,
			creditCardNumber: employee.creditCardNumber,
			creditCardExpirationDate: employee.creditCardExpirationDate,
			creditCardCVV: employee.creditCardCVV,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/admin/accountInfo", authenticateToken, async (req, res) => {
	try {
		const admin = await Admin.findById(req.user.id);

		if (!admin) {
			return res.status(404);
		}

		res.json({
			firstName: admin.firstName,
			lastName: admin.lastName,
			email: admin.email,
			password: admin.password,
			address: admin.address,
			creditCardNumber: admin.creditCardNumber,
			creditCardExpirationDate: admin.creditCardExpirationDate,
			creditCardCVV: admin.creditCardCVV,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post(
	"/api/employee/check_password",
	authenticateToken,
	async (req, res) => {
		try {
			const accountId = req.user.id;

			const input_password = req.body;

			const employee = await Employee.findById(accountId);

			if (
				employee &&
				(await bcrypt.compare(input_password.oldPassword, employee.password))
			) {
				res.json(true);
				res.status(201);
			} else {
				res.json(false);
				res.status(400);
			}
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	}
);

app.post("/api/admin/check_password", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;

		const input_password = req.body;

		const admin = await Admin.findById(accountId);

		if (
			admin &&
			(await bcrypt.compare(input_password.oldPassword, admin.password))
		) {
			res.json(true);
			res.status(201);
		} else {
			res.json(false);
			res.status(400);
		}
	} catch (err) {
		console.log(err);
		res.status(500).send(err);
	}
});

app.put("/api/employee/update", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;
		const newData = req.body;

		if (newData.password) {
			newData.password = await bcrypt.hash(newData.password, 10);
		}

		const employee = await Employee.findByIdAndUpdate(accountId, newData, {
			new: true,
		});

		if (!employee) {
			return res.status(404);
		}

		res.json({
			firstName: employee.firstName,
			lastName: employee.lastName,
			//email: employee.email,
			password: employee.password,
			//address: employee.address,
			//creditCardNumber: employee.creditCardNumber,
			//creditCardExpirationDate: employee.creditCardExpirationDate,
			//creditCardCVV: employee.creditCardCVV,
		});
		res.status(200);
	} catch (error) {
		res.status(500).send(error);
	}
});

app.put("/api/admin/update", authenticateToken, async (req, res) => {
	try {
		const accountId = req.user.id;
		const newData = req.body;

		if (newData.password) {
			newData.password = await bcrypt.hash(newData.password, 10);
		}

		const admin = await Admin.findByIdAndUpdate(accountId, newData, {
			new: true,
		});

		if (!admin) {
			return res.status(404);
		}

		res.json({
			firstName: admin.firstName,
			lastName: admin.lastName,
			//email: admin.email,
			password: admin.password,
			//address: admin.address,
			//creditCardNumber: admin.creditCardNumber,
			//creditCardExpirationDate: admin.creditCardExpirationDate,
			//creditCardCVV: admin.creditCardCVV,
		});
		res.status(200);
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

		// const token = jwt.sign({ id: employee._id }, "secret");
		// res.status(201).json({ token });
		res.status(201).json({ message: "Successfully created account" });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/api/admin/create_admin", authenticateToken, async (req, res) => {
	const { firstName, lastName, email, password, address } = req.body;

	try {
		const admin = await Admin.findById(req.user.id);

		if (!admin) {
			return res.status(404).json({ message: "Invalid Admin Credentials" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const adminDocument = new Admin({
			firstName: firstName,
			lastName: lastName,
			email: email,
			password: hashedPassword,
			address: address,
		});

		await adminDocument.save();

		//const token = jwt.sign({ id: admin_account._id }, "secret");
		res.status(201).json({ message: "Successfully created account" });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/api/admin/login", async (req, res) => {
	const { email, password } = req.body;
	console.log(await bcrypt.hash(password, 10));

	try {
		const admin = await Admin.findOne({ email: email });

		if (admin && (await bcrypt.compare(password, admin.password))) {
			const token = jwt.sign({ id: admin._id }, "secret");
			res.json({ token });
			res.status(201);
		} else {
			res.status(400).json({ message: "Invalid Admin Credentials" });
		}
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/admin/employee_accounts", authenticateToken, async (req, res) => {
	try {
		const admin = await Admin.findById(req.user.id);

		if (!admin) {
			return res.status(404).send("Invalid Token:");
		}

		const employee_accounts = await Employee.find();
		res.json(employee_accounts);
	} catch (error) {
		return res.status(500).send(error);
	}
});

app.get("/api/admin/accountName", authenticateToken, async (req, res) => {
	try {
		const account = await Admin.findById(req.user.id);

		if (!account) {
			return res.status(404);
		}

		res.json({ firstName: account.firstName, lastName: account.lastName });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/employee/accountName", authenticateToken, async (req, res) => {
	try {
		const account = await Employee.findById(req.user.id);

		if (!account) {
			return res.status(404);
		}

		res.json({ firstName: account.firstName, lastName: account.lastName });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/users/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const account = await Account.findById(id);

		if (!account) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			address: account.address,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.delete("/api/users/delete/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const account = await Account.findByIdAndDelete(id);

		if (!account) {
			return res.status(404).json({ message: "User not found" });
		}
		console.log("user account deleted");
		res.status(200).json({ message: "successfully deleted" });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.get("/api/employee/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const account = await Employee.findById(id);

		if (!account) {
			return res.status(404).json({ message: "Employee not found" });
		}

		res.json({
			firstName: account.firstName,
			lastName: account.lastName,
			email: account.email,
			address: account.address,
		});
	} catch (error) {
		res.status(500).send(error);
	}
});

app.delete("/api/employee/delete/:id", authenticateToken, async (req, res) => {
	try {
		const { id } = req.params;
		const account = await Employee.findByIdAndDelete(id);

		if (!account) {
			return res.status(404).json({ message: "Employee account not found" });
		}
		console.log("employee account deleted");
		res.status(200).json({ message: "successfully deleted" });
	} catch (error) {
		res.status(500).send(error);
	}
});

app.post("/api/add_scooter", authenticateToken, async (req, res) => {
	const {
		latitude,
		longitude,
		battery,
		model,
		availability,
		rentalPrice,
		id,
		waitTimeMinutes,
	} = req.body;

	try {
		const employee = await Employee.findById(req.user.id);
		const admin = await Admin.findById(req.user.id);

		if (!admin && !employee) {
			return res.status(404).send("Invalid Token");
		}

		const new_scooter = new Scooter({
			latitude,
			longitude,
			battery,
			model,
			availability,
			rentalPrice,
			id,
			waitTimeMinutes,
		});

		await new_scooter.save();

		res.status(201).json({ msg: "successfully made new scooter" });
	} catch (err) {
		return res.status(500).send(err);
	}
});

app.delete("/api/delete_scooter", authenticateToken, async (req, res) => {
	const { scooter_id } = req.query;
	console.log(scooter_id);

	try {
		const employee = await Employee.findById(req.user.id);
		const admin = await Admin.findById(req.user.id);

		if (!admin && !employee) {
			return res.status(404).send("Invalid Token");
		}

		const scooter = await Scooter.findByIdAndDelete(scooter_id);

		if (!scooter) {
			console.log("scooter not found ");
			return res.status(404).json({ msg: "scooter not found" });
		}

		console.log("scooter deleted");
		res.status(201).json({ msg: "scooter deleted" });
	} catch (err) {
		console.error("Error deleting scooter:", err);
		return res.status(500).send(err);
	}
});

app.get("/api/users/history/:id", authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id; 

        const admin = await Admin.findById(req.user.id);
        const employee = await Employee.findById(req.user.id);

        if (!admin && !employee) {
            return res.status(404).send("User not found");
        }

        const histories = await RentalHistory.find({
            "account._id": userId, 
            rental_end: { $exists: true }
        });

        console.log('Histories:', histories); 
        res.status(200).json(histories);
		
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).send(error.message); 
    }
});

module.exports = { app };
