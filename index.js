require("dotenv").config();

const http = require("http");
const fs = require("fs");

const port = process.env.PORT || 8000;

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  const query = url.searchParams;
  const match = url.pathname.match(/^\/api\/products\/(\d+)$/);
  const id = match ? match[1] : null;

  //console.log(url);
  console.log(id);
  console.log(pathname);
  console.log(query.get("item"));

  // Creating routes
  switch (true) {
    //TODO: /api/products -> GET all items
    case pathname === "/api/products" && req.method === "GET":
      res.end("GET Products list");
      break;

    //TODO: /api/products -> POST add new item to the list
    case pathname === "/api/products" && req.method === "POST":
      res.end("POST a new product");
      break;

    //TODO: /api/products/{id} -> GET a item from the list by id
    case id && req.method === "GET":
      res.end("GET product by id");
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
