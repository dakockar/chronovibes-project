const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  signedUp: {
    type: Date,
    default: Date.now
  },
  mood: String,
  isMoodChosen: {
    type: Boolean,
    default: false
  }
});

const User = model("User", userSchema);

module.exports = User;
