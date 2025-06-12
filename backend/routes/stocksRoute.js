const express = require("express");
const { getStockList } = require("../controllers/stocksController");
const router = express.Router();

router.route("/:id").get(getStockList);

module.exports = router;
