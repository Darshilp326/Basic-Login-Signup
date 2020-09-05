const express = require("express");
const router = express.Router();
const { recordController, authController } = require("../controllers");

router
  .route("/add")
  .post(authController.ensureAuthenticated, recordController.addPrescription);
router
  .route("/fetch")
  .get(authController.ensureAuthenticated, recordController.getRecord);
router
  .route("/fetch/doctor")
  .post(
    authController.ensureAuthenticated,
    recordController.getRecordsForDoctor
  );
router
  .route("/prescription/:id")
  .get(
    authController.ensureAuthenticated,
    recordController.getPrescriptionById
  );
router
  .route("/update/:id")
  .put(authController.ensureAuthenticated, recordController.updatePrescription);
router
  .route("/get/patients")
  .get(
    authController.ensureAuthenticated,
    recordController.getAllPatientsOfASpecificDoctor
  );
router
  .route("/delete/:id")
  .delete(
    authController.ensureAuthenticated,
    recordController.deletePrescription
  );
module.exports = router;
