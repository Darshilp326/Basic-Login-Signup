const express = require("express");
const router = express.Router();
const { userController, authController } = require("../controllers");

router.route("/signup").post(userController.registerUser);
router.route("/login").post(userController.loginUser);
router.route("/forgotpwd").post(authController.forgotPassword);
router.route("/resetpwd").post(authController.resetPassword);
router
  .route("/doctor/find")
  .post(authController.ensureAuthenticated, userController.findDoctor);

module.exports = router;
