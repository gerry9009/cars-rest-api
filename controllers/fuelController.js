const Products = require("../models/ProductsModel");

const fuelTypes = async (req, res) => {
  try {
    const fuelTypes = await Products.distinct("fuel_type");
    res.status(200).json(fuelTypes);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

module.exports = fuelTypes;
