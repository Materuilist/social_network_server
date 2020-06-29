const router = require("express").Router();
const { createToken, getCurrentUser } = require("../utils/token");

const User = require("../models/user");
const { encrypt, passwordsMatch } = require("../utils/password");
const exists = require("../utils/exists");

//регистрация
router.post("/signup", async (req, res, next) => {
  const { login, password } = req.body;
  let user = await User.findOne({ login });
  if (exists(user)) {
    return next({
      status: 403,
      errorMessage: "Пользователь с таким логином уже есть!",
    });
  }
  const encPassword = await encrypt(password);
  user = await User.create({
    login,
    password: encPassword,
    avatar: null,
    friends: [],
    requestedFriends: [],
  });
  const token = await createToken(user);
  res.status(201).json({
    jwt: token,
    user: {
      login: user.login,
      avatar: user.avatar,
      friends: user.friends,
      requestedFriends: user.requestedFriends,
    },
  });
});

router.post("/signin", async (req, res, next) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });

  if (!exists(user)) {
    return next({
      status: 404,
      errorMessage: "Пользователя с таким логином нет!",
    });
  }
  if (!(await passwordsMatch(password, login))) {
    return next({ status: 403, errorMessage: "Неверный пароль!" });
  }

  const token = await createToken(user);
  res
    .status(200)
    .json({
      jwt: token,
      user: {
        login: user.login,
        avatar: user.avatar,
        friends: user.friends,
        requestedFriends: user.requestedFriends,
      },
    });
});

router.get("/ping", async (req, res, next) => {
  let user;
  try {
    user = await getCurrentUser(req.headers);
  } catch {
    return next({ status: 401, errorMessage: "Токен не валиден" });
  }
  if (!user) {
    return next({ status: 404, errorMessage: "Такого пользователя нет" });
  }
  const { login, requestedFriends, friends, avatar } = user;
  res.status(200).json({ login, avatar, requestedFriends, friends });
});

module.exports = router;
