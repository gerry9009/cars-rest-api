const express = require("express");
const app = express();
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

require("dotenv").config();

const port = process.env.PORT || 8000;

const productsRouters = require("./routes/products");
const fuelsRoute = require("./routes/fuels");
const typesRoute = require("./routes/types");
const notFoundRoute = require("./routes/error");

// Middleware
app.use(bodyParser.json());

// routes
app.use("/api/products", productsRouters);
app.use("/api/fuels", fuelsRoute);
app.use("/api/types", typesRoute);
app.use("*", notFoundRoute);

// connect to the DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    // listen to the request
    app.listen(port, () => {
      console.log(`Server is running on ${port}`);
    });
  })
  .catch((err) => console.log(err));
