const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// initial user schema
// NOTE: will need fields for a friends list, password reset tokens, chat/comment lists, profile, bio, ...
var userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
	unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
	required: true,
    default: false,
  },

}, {timestamps: true});

// check if hashed password matches argument
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// pre-save hook for password salt
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) {
		next();
	}
	
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});


User = mongoose.model("User", userSchema);
module.exports = User;