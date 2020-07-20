const express = require("express");
const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register-submit", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    //checking the email in the DB
    const emailExist = await User.findOne({ email: req.body.email });
    if (!emailExist) {
      //HASHING THE PASSWORD
      const salt = await bcrypt.genSalt(10);
      console.log(salt);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      //Create a new user
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });
      try {
        //save a user
        const savedUser = await user.save();
        console.log(
          `New user having name ${savedUser.name} registered @${savedUser.date}.`
        );
        res.redirect("/success-user");
      } catch (e) {
        res.status(400).send(e);
      }
    } else {
      return res.status(400).send("Email already Exists!");
    }
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  } else {
    //checking the email in the DB
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("Email Does not exist!");
    } else {
      const validPass = await bcrypt.compare(req.body.password, user.password);
      if (!validPass) {
        return res.status(400).send("Password Does not exist!");
      } else {
        const token = await jwt.sign(
          { _id: user._id },
          process.env.TOKEN_SECRET
        );
        console.log(token);
        res.header("auth-token", token).send("logged IN");
      }
    }
  }
});

//          http://localhost:3000/api/user/
router.get("/get-users", (req, res) => {
  User.find()
    .sort({
      date: -1,
    })
    .limit(10)
    .then((users) => {
      const blankUserModel = {
        success: false,
        message: "Database does not contains USER.",
      };
      if (users.length === 0) {
        res.send(blankUserModel);
      } else {
        res.send(users);
      }
    })
    .catch((e) => {
      console.log(e);
    });
});

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/success-user", (req, res) => {
  res.render("success-user");
});

module.exports = router;
