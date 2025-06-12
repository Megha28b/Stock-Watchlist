const express = require("express");
const {
  getWatchlist,
  addToWatchlist,
  getStockDetail,
  updateStock,
  deleteStock,
} = require("../controllers/watchlistController");
const router = express.Router();

router.get("/", (req, res, next) => {
  return getWatchlist(req, res, next);
});

router.post("/", addToWatchlist);
router.route("/:id").get(getStockDetail).put(updateStock).delete(deleteStock);

module.exports = router;
