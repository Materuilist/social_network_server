const router = require("express").Router();
const {createToken} = require('../utils/token');

const User = require("../models/user");
const { encrypt, passwordsMatch } = require("../utils/password");
const exists = require("../utils/exists");

//регистрация
router.post("/signup", async (req, res, next) => {
  const { login, password } = req.body;
  const user = await User.findOne({ login });
  if (exists(user)) {
    return next({
      status: 403,
      errorMessage: "Пользователь с таким логином уже есть!",
    });
  }
  const encPassword = await encrypt(password);
  await User.create({ login, password: encPassword, friends:[] });
  res.status(201).json({ message: "Вы зарегистрированы!" });
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
    .json({ jwt: token, user: { login: user.login, friends: user.friends } });
});

module.exports = router;
