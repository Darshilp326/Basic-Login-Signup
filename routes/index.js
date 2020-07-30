const userRoute = require("./patients");
const doctorRoute = require("./doctors");
const recordroute = require("./records");
const express = require("express");
const router = express.Router();

router.use("/patients", userRoute);
router.use("/doctors", doctorRoute);
router.use("/records", recordRoute);
module.exports = router;
