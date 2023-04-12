const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");

const { getRandomId, getTypeList, getFuelsList } = require("./modules");
const { dataValidation } = require("./validations");

require("dotenv").config();

const port = process.env.PORT || 8000;

// Middlewares
app.use(bodyParser.json());

//*         /api/products -> GET all items
app.get("/api/products", (req, res) => {
  fs.readFile("./api/cars.json", (err, data) => {
    if (err) {
      res.status(500);
      res.send({ error: "Data not found" });
    } else {
      let cars = JSON.parse(data);

      res.send(cars);
    }
  });
  //TODO: Handle the queries here -> req.query
  /**
   * Queries
   *
   * name
   * fuel_types
   * type
   *
   * min_seats
   * max_seats
   *
   * min_price
   * max_price
   *
   * min_production_year
   * max_production_year
   */
});

//*        /api/products -> POST add new item to the list
app.post("/api/products", (req, res) => {
  let newCar = req.body;

  const error = dataValidation(newCar);
  const errors = Object.keys(error);

  if (errors.length) {
    res.status(400);
    res.send(JSON.stringify(error));
  } else {
    fs.readFile("./api/cars.json", (err, data) => {
      if (err) {
        res.status(500);
        res.send({ error: "Data not found" });
      } else {
        let cars = JSON.parse(data);
        newCar = { id: getRandomId(cars), ...newCar };
        cars.push(newCar);

        fs.writeFile("./api/cars.json", JSON.stringify(cars), () => {
          res.send(newCar);
        });
      }
    });
  }
});

//*         /api/products/{id} -> GET an item from the list by id
app.get("/api/products/:id", (req, res) => {
  const id = req.params.id;

  fs.readFile("./api/cars.json", (err, data) => {
    const cars = JSON.parse(data);
    const car = cars.filter((car) => car.id === id);
    if (!car.length) {
      res.status(404);
      res.send({ error: `id ${id} not found` });
    } else {
      res.send(car);
    }
  });
});

//TODO:         /api/products/{id} -> PATCH a item from the list by id
app.patch("/api/products/:id", (req, res) => {
  res.send("PATCH an item from the list by id");
});

//TODO:         /api/products/{id} -> DELETE an item from the list by id
app.delete("/api/products/:id", (req, res) => {
  res.send("DELETE an item from the list by id");
});

//*         /api/fuels
app.get("/api/fuels", (req, res) => {
  const fuelList = getFuelsList();
  res.send(fuelList);
});

//*         /api/types
app.get("/api/types", (req, res) => {
  const typeList = getTypeList();
  res.send(typeList);
});

app.get("*", (req, res) => {
  res.status(404);
  res.send({ error: "Page not found" });
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
