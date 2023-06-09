const express = require("express");
const router = express.Router();
const errorController = require("../controllers/errorController");

router.get("/", errorController);

module.exports = router;
