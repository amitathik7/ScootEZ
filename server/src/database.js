//#region imports ================================================================
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// import and configure environment variables from .env
dotenv.config();
const DB_URI = process.env.DB_URI;

//#endregion ======================================================================

// connect MongoDB with mongoose
if (process.env.NODE_ENV !== 'test') {
    mongoose.connect(DB_URI);
}
//mongoose.connect(DB_URI);
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


async function CreateAccount(account) {
    console.log("Creating the new account from model...");
    // create new Account from model
    const accountDocument = new Account({
        firstName: account.firstName,
        lastName: account.lastName,
        email: account.email,
        password: account.password,
        address: account.address,
        creditCard: account.creditCard
    });

    try {
        // saving to DB
        console.log("Saving to the DB...")
        await accountDocument.save();
        
        console.log("Finished! Successful.");
        return true;
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