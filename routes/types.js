const express = require("express");
const { getTypeList } = require("../modules");

const router = express.Router();

//*         /api/types
router.get("/", (req, res) => {
  const typeList = getTypeList();
  res.json(typeList);
});

module.exports = router;
