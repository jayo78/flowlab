const result = require("dotenv").config();

const { MONGO_HOSTNAME, MONGO_PORT, MONGO_ATLAS_URI } = process.env;

const dbConnectionURL = {
    LOCALURL: `mongodb://${MONGO_HOSTNAME}:${MONGO_PORT}`,
    ATLASURL: `${MONGO_ATLAS_URI}`,
};

module.exports = {
    mongoURI: MONGO_ATLAS_URI ? dbConnectionURL.ATLASURL : dbConnectionURL.LOCALURL,
    secretOrKey: "secret",
};
