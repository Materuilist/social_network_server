const router = require("express").Router();

const { getCurrentUser, createToken } = require("../utils/token");
const exists = require('../utils/exists');
const User = require("../models/user");

router.post("/update", async (req, res, next) => {
  const oldUser = await getCurrentUser(req.headers);

  //собирается менять логин
  if(exists(req.body.login)){
    if (await User.findOne({login:req.body.login})) {
      return next({
        status: 403,
        errorMessage: "Этот логин уже занят!",
      });
    }
  }

  await User.updateOne(oldUser, req.body);
  const newUser = await User.findOne({ login: req.body.login || oldUser.login });
  res
    .status(200)
    .json({
      userInfo: {
        login: newUser.login,
        avatar: newUser.avatar,
        requestedFriends: newUser.requestedFriends,
        friends: newUser.friends,
      },
      token:await createToken(newUser)
    });
});

module.exports = router;
