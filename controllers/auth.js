const jwt = require("jwt-simple");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();
const { User } = require("../models");
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const ensureAuthenticated = function (request, response, next) {
  console.log("inside auth");
  if (request.headers.authorization) {
    console.log("inside header");
    var token = request.headers.authorization.split(" ")[1];
    try {
      console.log("tryy");
      var decoded = jwt.decode(token, process.env.JWT_KEY);
      if (decoded.exp <= Date.now()) {
        response.json({
          status: 400,
          message: "Access token has expired", //ACCESS_TOKEN_EXPIRED
        });
      } else {
        console.log("else");
        request.user = decoded.user;
        return next();
      }
    } catch (error) {
      console.log(error);
      return response.json({
        status: 500,
        message: TOKEN_PARSING_ERROR,
      });
    }
  } else {
    console.log("if else");
    return response.json({
      status: 401,
      message: ACCESS_TOKEN_REQUIRED,
    });
  }
};
const sendPasswordResetMail = async (email, code) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASSWORD,
    },
  });
  let mailOptions = {
    from: EMAIL_USER,
    to: email,
    subject: "Medicine Scheduler Password Reset Mail",
    text: `Your password reset code is ${code}`,
  };
  try {
    const response = await transporter.sendMail(mailOptions);
    if (response) return true;
  } catch (error) {
    return false;
  }
};
const forgotPassword = async (req, res) => {
  //console.log(EMAIL_PASSWORD);
  //console.log(EMAIL_USER);
  const { email } = req.body;
  const patient = await User.findOne({ email });
  if (!patient) {
    return response.status(404).json({ msg: "No user found for this email." });
  }
  let code = Math.floor(100000 + Math.random() * 900000);
  let response = await sendPasswordResetMail(email, code);
  console.log(response);
  if (response === true) {
    await User.findByIdAndUpdate(
      {
        _id: patient.id,
      },
      {
        code,
      }
    );
    res.status(200).json({
      message: "Password reset code is sent to your email account",
    });
  } else {
    res.status(504).json({
      message: "Could not send password reset code to your email account",
    });
  }
};
const resetPassword = async (req, res) => {
  let { code, email, password, confirmPassword } = req.body;
  const patient = await User.findOne({ email });
  if (!patient) {
    return res.status(404).json({ msg: "Invalid email" });
  }
  if (confirmPassword !== password) {
    return res.status(403).json({ msg: "Passwords doesn't match" });
  }
  if (patient.code != code) {
    return res.status(401).json({
      msg: "Incorrect reset password code",
    });
  }
  let pwd = password;
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(pwd, salt);
  password = passwordHash;
  await User.findByIdAndUpdate(
    {
      _id: patient.id,
    },
    {
      password: password,
      code: 0,
    }
  );
  res.status(200).json({
    msg: "Password reset successful. You can now login with your new password",
  });
};
module.exports = {
  ensureAuthenticated,
  forgotPassword,
  sendPasswordResetMail,
  resetPassword,
};
