const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  login: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  requestedFriends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
});

const user = mongoose.model("User", userSchema);

module.exports = user;
