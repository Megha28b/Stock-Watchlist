const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  getStockDetail,
  updateStock,
  deleteStock,
} = require("../controllers/watchlistController");

const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, getWatchlist);
router.post("/", auth, addToWatchlist);
router
  .route("/:id")
  .get(auth, getStockDetail)
  .put(auth, updateStock)
  .delete(auth, deleteStock);

module.exports = router;
