const Products = require("../models/ProductsModel");

const types = async (req, res) => {
  try {
    const types = await Products.distinct("type");
    res.status(200).json(types);
  } catch (err) {
    res.status(404).json({ err: err });
  }
};

module.exports = types;
