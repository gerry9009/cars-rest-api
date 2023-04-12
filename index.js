const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

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

//*         /api/products -> GET all items
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

//*         /api/products -> POST add new item to the list
app.post("/api/products", (req, res) => {
  res.send("POST a new item to the list");
});

//*         /api/products/{id} -> GET an item from the list by id
app.get("/api/products/:id", (req, res) => {
  res.send("GET an item from the list by id");
});

//*         /api/products/{id} -> PATCH a item from the list by id
app.patch("/api/products/:id", (req, res) => {
  res.send("PATCH an item from the list by id");
});

//*         /api/products/{id} -> DELETE an item from the list by id
app.delete("/api/products/:id", (req, res) => {
  res.send("DELETE an item from the list by id");
});

//*         /api/fuels
app.get("/api/fuels", (req, res) => {
  res.send("Fuels type");
});

//*         /api/types
app.get("/api/types", (req, res) => {
  res.send("Car types");
});

app.get("*", (req, res) => {
  res.send("Default route");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
