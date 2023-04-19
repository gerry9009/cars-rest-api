const Products = require("../models/ProductsModel");
const mongoose = require("mongoose");

// GET all cars
//TODO: Query miatt ezt még módosítani kell
/*
Querying the data, use next filters:
min_price, max_price => car.price
min_production_year, max_production_year => car.production_year

name, fuel_type, type
 */
const getProducts = async (req, res) => {
  const { query } = req;

  //min_seats , max_seats => car.seats
  if (query.min_seats || query.max_seats) {
    if (query.min_seats && query.max_seats) {
      query.seats = { $gte: query.min_seats, $lte: query.max_seats };
    } else if (query.min_seats) {
      query.seats = { $gte: query.min_seats };
    } else {
      query.seats = { $lte: query.max_seats };
    }
    delete query.max_seats;
    delete query.min_seats;
  }

  if (query.min_price || query.max_price) {
    if (query.min_price && query.max_price) {
      query.price = { $gte: query.min_price, $lte: query.max_price };
    } else if (query.min_price) {
      query.price = { $gte: query.min_price };
    } else {
      query.price = { $lte: query.max_price };
    }
    delete query.min_price;
    delete query.max_price;
  }

  if (query.min_production_year || query.max_production_year) {
    if (query.min_production_year && query.max_production_year) {
      query.production_year = {
        $gte: query.min_production_year,
        $lte: query.max_production_year,
      };
    } else if (query.min_production_year) {
      query.production_year = { $gte: query.min_production_year };
    } else {
      query.production_year = { $lte: query.max_production_year };
    }
    delete query.min_production_year;
    delete query.max_production_year;
  }

  const cars = await Products.find(query);

  res.status(200).json(cars);
};

// POST add new item to the list
const createProduct = async (req, res) => {
  const { name, price, type, seats, production_year, fuel_type } = req.body;

  try {
    const car = await Products.create({
      name,
      price,
      type,
      seats,
      production_year,
      fuel_type,
    });
    res.status(200).json(car);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET a single car by id
const getProduct = async (req, res) => {
  const { id } = req.params;
  const types = mongoose.Types;
  console.log(types);

  if (mongoose.Types.ObjectId.isValid(id)) {
    const car = await Products.findById(id);
    res.status(200).json(car);
  } else {
    res.status(404).json({ error: "Data not found" });
  }
};

//UPDATE a single car by id
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    const car = await Products.findOneAndUpdate(
      { _id: id },
      {
        ...req.body,
      }
    );
    if (car) {
      res.status(200).json(car);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } else {
    res.status(404).json({ error: "Data not found" });
  }
};

// DELETE a single car by id
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (mongoose.Types.ObjectId.isValid(id)) {
    const car = await Products.findOneAndDelete({ _id: id });
    if (car) {
      res.status(200).json(car);
    } else {
      res.status(404).json({ error: "Data not found" });
    }
  } else {
    res.status(404).json({ error: "Data not found" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
};
