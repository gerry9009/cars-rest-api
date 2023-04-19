/**
 * This application is uploaded the cars.json api to the mongoDB
 *
 * Run this file the next commandline:
 * node post.js
 *
 */

const fs = require("fs");

fs.readFile("./api/cars.json", (err, data) => {
  const DB = JSON.parse(data);

  DB.forEach((data) => {
    delete data.id;
    data.price = data.price.substring(1);

    postDB(data);
  });
});

const postDB = (data) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch("http://localhost:8080/api/products", options)
    .then((resp) => resp.json())
    .then((data) => console.log(data))
    .catch((err) => console.log(err));
};
