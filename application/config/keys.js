const result = require('dotenv').config()

module.exports = {
  mongoURI: process.env.DB_CONN,
  secretOrKey: "secret"
};
