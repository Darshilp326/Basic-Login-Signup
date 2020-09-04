const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create user Schema & model
const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Name field is required"],
  },
  password: {
    type: String,
    required: [true, "Password field is required"],
  },
  phone: {
    type: String,
  },
  accessToken: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
