const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const initializeDB = require("./utils/initializeDB");

const authRouter = require("./routes/auth");
const friendsRouter = require("./routes/friends");

const app = express();

app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", bodyParser.json());

app.use("/auth", authRouter);
app.use("/friends", friendsRouter);

app.use("/", async (err, req, res, next) => {
  await res
    .status(err.status || 500)
    .json({
      message:
        err.errorMessage ||
        "Произошла ошибка на сервере... Извините за предоставленные неудобства!",
    });
});

mongoose.connect(
  "mongodb+srv://materuilist:borow123@socialnetwork-ygait.mongodb.net/socialNetwork?retryWrites=true&w=majority",
  async (err) => {
    if (err) {
      console.log(err);
      return;
    }

    //   await initializeDB();

    app.listen(3200);
  }
);
