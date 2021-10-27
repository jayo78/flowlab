require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");

const app = express();

app.use(express.json());
//app.use(passport.initialize());
//require("./config/passport")(passport);

app.use("/api/users", userRoute);

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));



const port = process.env.PORT || 3000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
