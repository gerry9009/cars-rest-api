const express = require("express");
const fs = require("fs");

const router = express.Router();

const { getRandomId } = require("../modules");
const { dataValidation } = require("../validations");

//*         /api/products -> GET all items
router.get("/", (req, res) => {
  const queries = req.query;
  const queryKeys = Object.keys(queries);
  // check the queries, if doesn't have, send the whole database
  if (queryKeys.length) {
    fs.readFile("./api/cars.json", (err, data) => {
      // check if any problem with the database
      if (err) {
        res.status(500);
        res.send({ error: "Data not found" });
      } else {
        // parse the JSON to array
        let cars = JSON.parse(data);

        // handle filtering database use queries
        for (const query of queryKeys) {
          // check the seats values
          // check the price values
          // check the production year values
          // check all properties of elements matching the query

          // filters items:
          // name, fuel_type, type, min_seats, max_seats,
          // min_price, max_price, min_production_year, max_production_year

          if (query === "min_seats") {
            cars = cars.filter((car) => car.seats > queries[query]);
          } else if (query === "max_seats") {
            cars = cars.filter((car) => car.seats < queries[query]);
          } else if (query === "min_price") {
            cars = cars.filter((car) => {
              const price = car.price.substring(1);
              return Number(price) > Number(queries[query]);
            });
          } else if (query === "max_price") {
            cars = cars.filter((car) => {
              const price = car.price.substring(1);
              return Number(price) < Number(queries[query]);
            });
          } else if (query === "min_production_year") {
            cars = cars.filter((car) => car.production_year > queries[query]);
          } else if (query === "max_production_year") {
            cars = cars.filter((car) => car.production_year < queries[query]);
          } else {
            cars = cars.filter((car) => car[query] === queries[query]);
          }
        }

        // send data to the client
        res.json(cars);
      }
    });
  } else {
    // get the database form the json
    fs.readFile("./api/cars.json", (err, data) => {
      // check if any problem with the database
      if (err) {
        res.status(500);
        res.json({ error: "Data not found" });
      } else {
        // parse the JSON to array
        let cars = JSON.parse(data);

        // send data to the client
        res.json(cars);
      }
    });
  }
});

//*        /api/products -> POST add new item to the list
router.post("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.patch("/:id", (req, res) => {
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
      if (err) {
        res.status(500);
        res.send({ error: "Data not found" });
      } else {
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
      }
    });
  }
});

//*         /api/products/{id} -> DELETE an item from the list by id
router.delete("/:id", (req, res) => {
  //get the id from the body
  const id = req.params.id;

  // get the database from JSON
  fs.readFile("./api/cars.json", (err, data) => {
    // send error if any problem with the database
    if (err) {
      res.status(500);
      res.send({ error: "Data not found" });
    } else {
      // if the database exist, parse data from JSON
      const cars = JSON.parse(data);

      // find the required item by id
      const filteredCar = cars.filter((car) => car.id === id);

      // if the item exist, delete
      if (filteredCar.length) {
        // delete item by id
        const newCars = cars.filter((car) => car.id !== id);

        fs.writeFile("./api/cars.json", JSON.stringify(newCars), () => {
          //send back the deleted item to the client
          res.send(filteredCar);
        });
      } else {
        // if the item doesn't exist send error
        res.status(404);
        res.send({ error: `id ${id} not found` });
      }
    }
  });
});

module.exports = router;
