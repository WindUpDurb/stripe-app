"use strict";

var express = require("express");
var router = express.Router();

router.use("/users", require("./users"));
router.use("/generalStock", require("./generalStock"));
router.use("/currentStock", require("./currentStock"));

module.exports = router;