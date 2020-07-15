const bcrypt = require("bcryptjs");
const { User } = require("../models");
const jwt = require("jsonwebtoken");

const loginUser = function (req, res, next) {
  User.findOne({ email: req.body.email })
    .then(function (user) {
      if (user.length < 1) {
        res.status(401).json({ message: "Authentication failed" });
      }
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (err) {
          res.status(401).json({ message: "User not found" });
        }
        if (result) {
          const token = jwt.sign({ email: user.email }, process.env.JWT_KEY, {
            expiresIn: "1h",
          });
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: "Authentication failed" });
        }
      });
    })
    .catch((err) => console.log(err));
};
const registerUser = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(200).json({ msg: "Please enter all fields" });
  }
  User.findOne({ email: email }).then((user) => {
    if (user) {
      return res
        .status(403)
        .json({ message: "Email is already registered with us." });
    } else {
      const newUser = new User(req.body);

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              res.send(user);
            })
            .catch((err) => console.log(err));
        });
      });
    }
  });
};
module.exports = {
  registerUser,
  loginUser,
};
