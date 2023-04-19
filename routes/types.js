const express = require("express");
const getTypes = require("../controllers/typesController");

const router = express.Router();

//*         /api/types
router.get("/", getTypes);

module.exports = router;
