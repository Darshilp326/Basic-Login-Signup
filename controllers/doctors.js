const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const moment = require("moment");
const { Doctor, User } = require("../models");
function createJwtToken(user) {
  const payload = {
    user,
    iat: new Date().getTime(),
    exp: moment().add(7, "days").valueOf(),
  };
  return jwt.encode(payload, process.env.JWT_KEY);
}
const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, field } = req.body;
    const user = await Doctor.findOne({
      email,
    });
    if (user) {
      return res.status(400).json({ msg: "Email is already registered" });
    }
    const doctor = new Doctor({
      name,
      email,
      password,
      field,
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(doctor.password, salt, (err, hash) => {
        if (err) throw err;
        doctor.password = hash;
        doctor
          .save()
          .then((user) => {
            res.send(user);
          })
          .catch((err) => console.log(err));
      });
    });
  } catch (e) {
    console.log(e.message);
    res.status(500).json({ msg: "Invalid request" });
  }
};
const loginDoctor = function (req, res, next) {
  Doctor.findOne({ email: req.body.email })
    .then(function (user) {
      console.log(user);
      if (!user) {
        res.status(401).json({ message: "Doctor not found" });
      }
      bcrypt.compare(req.body.password, user.password, function (err, result) {
        if (err) {
          res.status(401).json({ message: "Please check your password" });
        }
        if (result) {
          console.log("!");
          const token = createJwtToken({ id: user.id });
          res.status(200).json({ token });
        } else {
          res.status(401).json({ message: "Authentication failed" });
        }
      });
    })
    .catch((err) => console.log(err));
};
const findPatient = async (req, res) => {
  const { email } = req.body;
  const patient = await User.findOne({ email });
  if (!patient) {
    return res.status(400).json({ msg: "Patient not found" });
  }
  res.status(200).json({ patient });
};
const getDoctorById = async (req, res) => {
  const id = req.params.id;
  const doctor = await Doctor.findById(id);
  if (!doctor) {
    return res.status(404).json({ msg: "Doctor not found" });
  }
  res.status(200).json({ doctor });
};
module.exports = {
  registerDoctor,
  loginDoctor,
  findPatient,
  getDoctorById,
};
