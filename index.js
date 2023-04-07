require("dotenv").config();

const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 8000;

const { getRandomId } = require("./modules.js");
const { dataValidation } = require("./validations.js");

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // GET All queries
  const query = url.searchParams;
  const queries = query.entries();

  // Get ID from the URL
  const match = url.pathname.match(/^\/api\/products\/(\d+)$/);
  const id = match ? match[1] : null;

  //console.log(url);
  console.log(id);
  console.log(pathname);
  //console.log(query.get());

  // Creating routes
  switch (true) {
    //*     /api/products -> GET all items
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

    //*     /api/products -> POST add new item to the list
    case pathname === "/api/products" && req.method === "POST":
      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        let newCar = JSON.parse(body);

        // Validate the POSTed value
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
              console.log(newCar);
              const cars = JSON.parse(data);
              newCar = { id: getRandomId(cars), ...newCar };
              cars.push(newCar);
              fs.writeFile("./api/cars.json", JSON.stringify(cars), () => {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(newCar));
              });
            }
          });
        }
      });
      break;

    //*      /api/products/{id} -> GET a item from the list by id
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

    //TODO: /api/products/{id} -> PATCH a item from the list by id
    case id && req.method === "PATCH":
      res.end("EDIT product by id");
      break;

    //TODO: /api/products/{id} -> DELETE a item from the list by id
    case id && req.method === "DELETE":
      res.end("DELETE product by id");
      break;

    //TODO: Get default response
    default:
      res.writeHead(404);
      res.end("Page not found");
  }
});

server.listen(port, () => console.log(`Server is running on ${port}`));
