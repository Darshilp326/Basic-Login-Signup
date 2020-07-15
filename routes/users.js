const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");

router.route("/signup").post(userController.registerUser);
router.route("/login").post(userController.loginUser);

module.exports = router;
