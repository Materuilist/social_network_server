const router = require("express").Router();

const User = require("../models/user");
const { getCurrentUser } = require("../utils/token");
const exists = require("../utils/exists");

// получение текущего пользователя
router.use("/", async (req, res, next) => {
  let user;
  try {
    user = await getCurrentUser(req.headers);
  } catch {
    return next({ status: 401, errorMessage: "Вы не авторизованы!" });
  }
  if (!user) {
    return next({ status: 404, errorMessage: "Такого пользователя нет!" });
  }
  req.user = user;
  next();
});

router.get("/", async (req, res, next) => {
  return res.status(200).json({
    friends: req.user.friends,
    requestedFriends: req.user.requestedFriends,
  });
});

router.post("/add", async (req, res, next) => {
  const currentUser = req.user;
  const addedUser = await User.findOne({ login: req.body.login });
  const isAlreadyRequested = exists(
    currentUser.requestedFriends.find((friend) => friend == addedUser.id)
  );
  if (isAlreadyRequested) {
    return next({
      status: 403,
      errorMessage: "Запрос в друзья уже отправлен!",
    });
  }

  const isMutualFriendRequest = exists(
    addedUser.requestedFriends.find((friend) => friend == currentUser.id)
  );
  if (isMutualFriendRequest) {
    currentUser.friends.push(addedUser.id);
    addedUser.friends.push(currentUser.id);
    addedUser.requestedFriends.splice(
      addedUser.requestedFriends.indexOf(currentUser.id),
      1
    );
    await addedUser.save();
    await currentUser.save();
    return res
      .status(200)
      .json({ message: `Теперь вы с ${addedUser} друзья!` });
  }
  currentUser.requestedFriends.push(addedUser.id);
  await currentUser.save();
  res.status(200).json({ message: `Запрос в друзья ${addedUser} отправлен!` });
});

module.exports = router;
