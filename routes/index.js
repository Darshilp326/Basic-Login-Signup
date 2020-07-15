const userRoute = require("./users");
const express = require("express");
const router = express.Router();

router.use("/users", userRoute);

module.exports = router;
