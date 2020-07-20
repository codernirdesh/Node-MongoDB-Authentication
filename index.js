const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//Import Route
const authRoute = require("./router/auth");
const postRoute = require("./router/posts");

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to DB.");
  }
);

//Middlewares
// app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Route Middleware
app.use("/", authRoute);
app.use("/post", postRoute);

app.listen(3000, () => console.log("Server is UP."));
