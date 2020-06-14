const jwt = require("jsonwebtoken");
const User = require("../models/user");

const SECRET = "kiskamariskatakata";
const EXPIRES_IN = 172800;

module.exports = {
  createToken(user) {
    return new Promise((resolve) => {
      jwt.sign(
        { login: user.login },
        SECRET,
        {
          expiresIn: EXPIRES_IN, // 2 дня
        },
        (err, token) => {
          resolve(token);
        }
      );
    });
  },

  getCurrentUser(headers) {
    return new Promise((resolve, reject) => {
      const token = headers.authorization.split(":")[1];
      if (!token) {
        reject();
      }
      jwt.verify(token, SECRET, async (err, decodedUser) => {
        if (err) {
          return reject(err);
        }
        const user = await User.findOne({ login: decodedUser.login });
        resolve(user);
      });
    });
  },
};
