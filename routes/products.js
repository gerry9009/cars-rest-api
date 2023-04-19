const express = require("express");

const {
  getProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productControllers");

const router = express.Router();

//*         /api/products -> GET all items
//TODO: Query miatt ezt még módosítani kell
router.get("/", getProducts);

//*        /api/products -> POST add new item to the list
router.post("/", createProduct);

//*         /api/products/{id} -> GET an item from the list by id
router.get("/:id", getProduct);

//*         /api/products/{id} -> PATCH a item from the list by id
router.patch("/:id", updateProduct);

//*         /api/products/{id} -> DELETE an item from the list by id
router.delete("/:id", deleteProduct);

module.exports = router;
