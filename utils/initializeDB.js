const User = require("../models/user");
const { encrypt } = require("../utils/password");

module.exports = async function () {
  await User.deleteMany();

  await User.create({
    login: "materuilist",
    password: await encrypt('borow123'),
    friends:[],
    requestedFriends:[],
  });
};
