const userRoute = require("./patients");
const doctorRoute = require("./doctors");
const express = require("express");
const router = express.Router();

router.use("/patients", userRoute);
router.use("/doctors", doctorRoute);
module.exports = router;
