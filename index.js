const http = require("http");
const fs = require("fs");
require("dotenv").config();

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  res.end("Server");
});

server.listen(port, () => console.log(`Server is running on ${port}`));
