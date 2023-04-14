const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");

const { getRandomId, getTypeList, getFuelsList } = require("./modules");
const { dataValidation } = require("./validations");

require("dotenv").config();

const port = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.json());

//*         /api/products -> GET all items
app.get("/api/products", (req, res) => {
  // get the database form the json
  fs.readFile("./api/cars.json", (err, data) => {
    // check if any problem with the database
    if (err) {
      res.status(500);
      res.send({ error: "Data not found" });
    } else {
      // parse the JSON to array
      let cars = JSON.parse(data);

      // send data to the client
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
  // get the new data from the body
  let newCar = req.body;

  // check data validation
  const error = dataValidation(newCar);
  const errors = Object.keys(error);

  // check the error messages, if any, send them to the client
  if (errors.length) {
    res.status(400);
    res.send(JSON.stringify(error));
  } else {
    // if not any error, get data from the database
    fs.readFile("./api/cars.json", (err, data) => {
      if (err) {
        res.status(500);
        res.send({ error: "Data not found" });
      } else {
        // parse data from the json
        let cars = JSON.parse(data);

        // create new car, used data from body and add a randomId
        newCar = { id: getRandomId(cars), ...newCar };

        // push the new car to the database
        cars.push(newCar);

        // overwrite the database with the new item
        fs.writeFile("./api/cars.json", JSON.stringify(cars), () => {
          res.send(newCar);
        });
      }
    });
  }
});

//*         /api/products/{id} -> GET an item from the list by id
app.get("/api/products/:id", (req, res) => {
  // get the id from the body
  const id = req.params.id;

  // get the database, find the element and send back to the client
  fs.readFile("./api/cars.json", (err, data) => {
    const cars = JSON.parse(data);
    const car = cars.filter((car) => car.id === id);
    if (!car.length) {
      // if the element is not exist, send an error
      res.status(404);
      res.send({ error: `id ${id} not found` });
    } else {
      res.send(car);
    }
  });
});

//*         /api/products/{id} -> PATCH a item from the list by id
app.patch("/api/products/:id", (req, res) => {
  // get the id and the modifier data from the body
  const id = req.params.id;
  const modifiedCar = req.body;

  // check data validation
  const errors = dataValidation(modifiedCar);
  const values = Object.keys(modifiedCar);

  let error = {};

  // get error messages which are input errors
  values.forEach((value) => {
    if (errors[value]) {
      error[value] = errors[value];
    }
  });

  // if have input errors, throw an error message to the client
  if (Object.keys(error).length) {
    res.status(500);
    res.send(JSON.stringify(error));
  } else {
    // get the database
    fs.readFile("./api/cars.json", (err, data) => {
      const cars = JSON.parse(data);

      // found the filtered element by id
      const filteredCar = cars.filter((car) => car.id === id);

      // check the element exists
      if (filteredCar.length) {
        // modify data in the element and change the element in the database
        const newCar = { ...filteredCar[0], ...modifiedCar };
        const newCars = cars.map((car) => {
          if (car.id === id) {
            return newCar;
          } else {
            return car;
          }
        });

        // overwrite the data with new value
        fs.writeFile("./api/cars.json", JSON.stringify(newCars), () => {
          // send back to the client the modified element
          res.send(newCar);
        });

        // if element not exist send error to the client
      } else {
        res.status(404);
        res.send({ error: `id ${id} not found` });
      }
    });
  }
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
