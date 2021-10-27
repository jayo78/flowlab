const mongoose = require("mongoose");

// token that references a specific user, token field should be a unique string
// used for email verification and password resets 
const tokenSchema = mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' 
    },
  
    token: { 
        type: String, 
        required: true 
    },
  
    createdAt: { 
        type: Date, 
        required: true,
        default: Date.now, 
        expires: 86400000 
  }
});

Token = mongoose.model("tokens", tokenSchema);
module.exports = Token;