require("dotenv").config();

const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 8000;

const { getRandomId, getTypeList, getFuelsList } = require("./modules.js");
const { dataValidation } = require("./validations.js");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // GET All queries
  const query = url.searchParams;
  const queryEntries = query.entries();

  let queries = {};
  let queriesKeys = [];
  for (const query of queryEntries) {
    queries[query[0]] = query[1];
    queriesKeys.push(query[0]);
  }

  // Get ID from the URL
  const match = url.pathname.match(/^\/api\/products\/(\d+)$/);
  const id = match ? match[1] : null;

  // Creating routes
  switch (true) {
    //*         /api/products -> GET all items
    case pathname === "/api/products" && req.method === "GET":
      fs.readFile("./api/cars.json", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Data not found");
        } else {
          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(data);
        }
      });
      break;

    //*         /api/products -> POST add new item to the list
    case pathname === "/api/products" && req.method === "POST":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        let newCar = JSON.parse(body);

        // Validate the DATA's value
        const error = dataValidation(newCar);
        const errors = Object.keys(error);
        if (errors.length) {
          res.writeHead(400);
          res.end(JSON.stringify(error));
        } else {
          fs.readFile("./api/cars.json", (err, data) => {
            if (err) {
              res.writeHead(500);
              res.end("Data error");
            } else {
              const cars = JSON.parse(data);
              newCar = { id: getRandomId(cars), ...newCar };
              cars.push(newCar);
              fs.writeFile("./api/cars.json", JSON.stringify(cars), () => {
                // give back the new car as response
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(newCar));
              });
            }
          });
        }
      });
      break;

    //*         /api/products/{id} -> GET a item from the list by id
    case id && req.method === "GET":
      fs.readFile("./api/cars.json", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Data error");
        } else {
          const cars = JSON.parse(data);
          const car = cars.filter((car) => car.id === id);

          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify(car));
        }
      });
      break;

    //*         /api/products/{id} -> PATCH a item from the list by id
    case id && req.method === "PATCH":
      let modifyBody = "";

      req.on("data", (chunk) => {
        modifyBody += chunk.toString();
      });

      req.on("end", () => {
        let modifications = JSON.parse(modifyBody);

        fs.readFile("./api/cars.json", (err, data) => {
          if (err) {
            res.writeHead(500);
            res.end("Data error");
          } else {
            const cars = JSON.parse(data);

            const selectedCar = cars.filter((car) => car.id === id);

            if (selectedCar.length) {
              const newCar = { ...selectedCar[0], ...modifications };
              const error = dataValidation(newCar);
              const errors = Object.keys(error);

              if (errors.length) {
                res.writeHead(400);
                res.end(JSON.stringify(error));
              } else {
                const modifiedCars = cars.map((car) => {
                  if (car.id === id) {
                    car = { ...newCar };
                  }
                  return car;
                });

                fs.writeFile(
                  "./api/cars.json",
                  JSON.stringify(modifiedCars),
                  () => {
                    res.setHeader("Type-Content", "application/json");
                    res.writeHead(200);
                    res.end(JSON.stringify(newCar));
                  }
                );
              }
            } else {
              res.writeHead(400);
              res.end("Non-exist id");
            }
          }
        });
      });

      break;

    //*         /api/products/{id} -> DELETE a item from the list by id
    case id && req.method === "DELETE":
      fs.readFile("./api/cars.json", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Data error");
        } else {
          const cars = JSON.parse(data);

          const filtered = cars.filter((car) => car.id === id);

          if (filtered.length) {
            const newCars = cars.filter((car) => car.id !== id);

            fs.writeFile("./api/cars.json", JSON.stringify(newCars), () => {
              res.setHeader("Content-Type", "application/json");
              res.writeHead(200);
              res.end(JSON.stringify(filtered));
            });
          } else {
            res.writeHead(400);
            res.end("Non-exist id");
          }
        }
      });
      break;

    case pathname === "/api/products/" &&
      req.method === "GET" &&
      queriesKeys.length > 0:
      /**
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
      fs.readFile("./api/cars.json", (err, data) => {
        if (err) {
          res.writeHead(500);
          res.end("Data error");
        } else {
          let cars = JSON.parse(data);

          //*       Querying data
          for (const query of queriesKeys) {
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

          res.setHeader("Content-Type", "application/json");
          res.writeHead(200);
          res.end(JSON.stringify(cars));
        }
      });

      break;
    //*         /api/fuels
    case pathname === "/api/fuels" && req.method === "GET":
      res.end(JSON.stringify(getFuelsList()));
      break;

    //*         /api/types
    case pathname === "/api/types" && req.method === "GET":
      res.end(JSON.stringify(getTypeList()));
      break;

    //*         Get default response
    default:
      res.writeHead(404);
      res.end("Page not found");
  }
});

server.listen(port, () => console.log(`Server is running on ${port}`));
