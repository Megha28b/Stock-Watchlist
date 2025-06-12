const express = require("express");
const { getStockList } = require("../controllers/stocksController");
const auth = require("../middleware/authMiddleware"); // 🔒 Add this

const router = express.Router();

router.route("/:id").get(auth, getStockList);

module.exports = router;
