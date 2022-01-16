const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { MONGO_DEV, MONGO_PROD } = process.env;

let DB_URI = process.env.NODE_ENV === "development" ? MONGO_DEV : MONGO_PROD;

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log("connected to database");
    } catch (error) {
        console.error(`connecting to database failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
