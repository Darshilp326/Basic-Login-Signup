const express = require("express");
const router = express.Router();
const { recordController, authController } = require("../controllers");

router
  .route("/add")
  .post(authController.ensureAuthenticated, recordController.addPrescription);
router
  .route("/fetch")
  .get(authController.ensureAuthenticated, recordController.getRecord);
/*router
  .route("/update/:id")
  .put(authController.ensureAuthenticated, recordController.updateRecord);*/

module.exports = router;
