const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema({
  _userId: { 
    //type: mongoose.Schema.Types.ObjectId, 
    type: String,
    required: true, 
    ref: 'User' 
  },
  token: { 
    type: String, 
    required: true 
  },
  expireAt: { 
    type: Date, 
    default: Date.now, 
    index: { 
      expires: 86400000 
    } 
  }
});

module.exports = User = mongoose.model("tokens", TokenSchema);
