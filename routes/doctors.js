const express = require("express");
const router = express.Router();
const { doctorController, authController } = require("../controllers");
router.route("/signup").post(doctorController.registerDoctor);
router.route("/login").post(doctorController.loginDoctor);
router
  .route("/patient/find")
  .post(authController.ensureAuthenticated, doctorController.findPatient);

module.exports = router;
