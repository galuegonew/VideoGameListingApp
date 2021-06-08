const mongoose = require("mongoose");
const Schema = mongoose.Schema; // object use to create Schemas

const UserSchema = new Schema({
  Username: {
    type: String,
    required: [true, "Username field is required"],
  },
  Password: {
    type: String,
    required: [true, "Password field is required"],
  },
});

const User = mongoose.model("users", UserSchema);

module.exports = User;