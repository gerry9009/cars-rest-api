const express = require("express");
const { getFuelsList } = require("../modules");

const router = express.Router();

//*         /api/fuels
router.get("/", (req, res) => {
  const fuelList = getFuelsList();
  res.json(fuelList);
});

module.exports = router;
