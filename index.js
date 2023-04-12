const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");

const { getRandomId } = require("./modules");

require("dotenv").config();

const port = process.env.PORT || 8000;

// Middlewares
app.use(bodyParser.json());

/**
 * "id": string,
 * "name": string,
 * "price": string,
 * "type":string,
 * "seats":number,
 * "production_year": number,
 * "fuel_type": string
 */

//TODO:         /api/products -> GET all items
app.get("/api/products", (req, res) => {
  res.send("GET all items");
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

  fs.readFile("./api/cars.json", (err, data) => {
    if (err) {
      res.send("Data not found");
    } else {
      let cars = JSON.parse(data);
      newCar = { id: getRandomId(cars), ...newCar };
      cars.push(newCar);

      fs.writeFile("./api/cars.json", JSON.stringify(cars), () => {
        res.send(JSON.stringify(newCar));
      });
    }
  });
});

//TODO:         /api/products/{id} -> GET an item from the list by id
app.get("/api/products/:id", (req, res) => {
  res.send("GET an item from the list by id");
});

//TODO:         /api/products/{id} -> PATCH a item from the list by id
app.patch("/api/products/:id", (req, res) => {
  res.send("PATCH an item from the list by id");
});

//TODO:         /api/products/{id} -> DELETE an item from the list by id
app.delete("/api/products/:id", (req, res) => {
  res.send("DELETE an item from the list by id");
});

//TODO:         /api/fuels
app.get("/api/fuels", (req, res) => {
  res.send("Fuels type");
});

//TODO:         /api/types
app.get("/api/types", (req, res) => {
  res.send("Car types");
});

app.get("*", (req, res) => {
  res.send("Default route");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
