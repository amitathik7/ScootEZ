//#region imports ================================================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import and configure environment variables from .env
dotenv.config();
const DB_URI = process.env.DB_URI;

//#endregion ======================================================================

// connect MongoDB with mongoose
mongoose.connect(DB_URI);
const db = mongoose.connection;

// MongoDB connection error messages
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));
db.once('open', () => { console.log('MongoDB Connected'); });

//#region initialize database content ==============================================

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

// Initialize MongoDB collections (using mongoose.model)
const Account = mongoose.model('account', accountSchema);
const Scooter = mongoose.model('scooter', scooterSchema);
const Employee = mongoose.model('employee', employeeSchema);
const Admin = mongoose.model('admin', adminSchema);
const RentalHistory = mongoose.model('history', rentalHistorySchema);

//#endregion ======================================================================

//#region CRUD operations ==========================================================

// Create:
// Read
// update
// delete


async function CreateAccount({firstName, lastName, email, password, address, creditCard}) {
    console.log(`Creating an account for the ${firstname} ${lastname} in the DB...`)

    // create new Account from model
    const accountDocument = new Account({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        address: address,
        creditCard: creditCard
    });

    try {
        // saving to DB
        await accountDocument.save();
        console.log("Finished! Successful.");
    }
    catch {
        console.log("Finished! Unsuccessful.");
        return false;
    }
}

async function FindAccount(email) {
    console.log(`Searching for an account with the email "${email}" in the DB...`)
    const account = await Account.findOne({email: email });
    console.log("finished searching, returning result...");
    return account;
}

//#endregion =======================================================================

module.exports = {
    CreateAccount,
    FindAccount
};