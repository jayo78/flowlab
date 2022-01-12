const result = require('dotenv').config()

const {
    MONGO_HOSTNAME,
    MONGO_PORT
} = process.env;

const dbConnectionURL = {
    'LOCALURL': `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`
};


module.exports = {
  mongoURI: dbConnectionURL.LOCALURL,
  //mongoURI: process.env.DB_CONN,
  secretOrKey: "secret"
};
