const express = require("express");
const mongoose = require("mongoose");

const initializeDB = require('./utils/initializeDB');

const app = express();

app.use("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
});

mongoose.connect(
  "mongodb+srv://materuilist:borow123@socialnetwork-ygait.mongodb.net/socialNetwork?retryWrites=true&w=majority",
  async err=>{
      if(err){
          console.log(err);
          return;
      }

    //   await initializeDB();

      app.listen(3200);
  }
);
