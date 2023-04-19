const express = require("express");
const fuelTypes = require("../controllers/fuelController");

const router = express.Router();

//*         /api/fuels
router.get("/", fuelTypes);

module.exports = router;
