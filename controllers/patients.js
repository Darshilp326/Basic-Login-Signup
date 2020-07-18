const bcrypt = require("bcryptjs");
const { User, Doctor } = require("../models");
const jwt = require("jwt-simple");
const moment = require("moment");
// const createJwtToken = require("../utils/commonfunctions");
function createJwtToken(user) {
  const payload = {
    user,
    iat: new Date().getTime(),
    exp: moment().add(7, "days").valueOf(),
  };
  return jwt.encode(payload, process.env.JWT_KEY);
}

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
          const token = createJwtToken({ id: user.id });
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
const findDoctor = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ msg: "Please fill required doctor's email." });
    }
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ msg: "Doctor not found" });
    }
    return res.status(200).json(doctor);
  } catch {
    res.status(500).json({ msg: "Please check your entered details." });
  }
};
module.exports = {
  registerUser,
  loginUser,
  findDoctor,
};
