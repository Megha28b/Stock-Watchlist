const asyncHandler = require("express-async-handler");
const axios = require("axios");
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

//@desc Get Stocks according to search
//@route GET /api/stocks/:id
//@access public
const getStockList = asyncHandler(async (req, res) => {
  const symbol = req.params.id;
  const url = "https://www.alphavantage.co/query";

  const params = {
    function: "SYMBOL_SEARCH",
    keywords: symbol,
    apikey: API_KEY,
  };
  const response = await axios.get(
    url,
    { params },
    { json: true },
    { headers: { "User-Agent": "request" } }
  );
  if (!response.data.bestMatches) {
    res.status(404);
    throw new Error(`No match found for symbol ${symbol}`);
  }

  res.status(200).json({ quote: response.data});
});

module.exports = { getStockList };
