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