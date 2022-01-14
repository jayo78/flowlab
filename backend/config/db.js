const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const { MONGO_LOCAL, MONGO_HOSTED } = process.env;

let NODE_ENV = process.env.NODE_ENV;
let MONGO;

if (NODE_ENV === "development") {
    MONGO = MONGO_LOCAL;
} else {
    MONGO = MONGO_HOSTED;
}

const connectDB = async () => {
    try {
        const _conn = await mongoose.connect(MONGO);
        console.log("connected to database");
    } catch (error) {
        console.error(`connecting to database failed: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
