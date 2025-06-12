const asyncHandler = require("express-async-handler");
const axios = require("axios");
const db = require("../db");
const API_KEY = process.env.ALPHA_VANTAGE_KEY;

//@desc Get Stocks in watchlist
//@route GET /api/watchlist
//@access public
const getWatchlist = asyncHandler(async (req, res) => {
  const term = req.query.term?.trim();
  const category = req.query.category?.trim();

  const conditions = [];
  const values = [];
  let idx = 1;

  if (term) {
    const pattern = `%${term}%`;
    // apply to multiple columns
    conditions.push(`(
        symbol ILIKE $${idx}
        OR name ILIKE $${idx}
        OR type ILIKE $${idx}
        OR region ILIKE $${idx}
        OR timezone ILIKE $${idx}
        OR currency ILIKE $${idx}
        OR category ILIKE $${idx}
      )`);
    values.push(pattern);
    idx++;
  }

  if (category) {
    conditions.push(`category = $${idx}`);
    values.push(category);
    idx++;
  }

  let sql = "SELECT * FROM watchlist";
  if (conditions.length) {
    sql += " WHERE " + conditions.join(" AND ");
  }
  sql += " ORDER BY id;";

  const result = await db.query(sql, values);
  res.status(200).json({ count: result.rows.length, items: result.rows });
});

//@desc Add Stocks in watchlist
//@route POST /api/watchlist
//@access public
const addToWatchlist = asyncHandler(async (req, res) => {
  const { data, category } = req.body;

  if (!data["1. symbol"] || !data["2. name"] || !category) {
    res.status(400);
    throw new Error(
      "Fields '1. symbol', '2. name', and 'category' are required"
    );
  }

  const record = {
    symbol: data["1. symbol"],
    name: data["2. name"],
    type: data["3. type"],
    region: data["4. region"],
    market_open: data["5. marketOpen"],
    market_close: data["6. marketClose"],
    timezone: data["7. timezone"],
    currency: data["8. currency"],
    category,
  };

  const insertQuery = `
      INSERT INTO watchlist
        (symbol, name, type, region, market_open, market_close, timezone, currency)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `;

  const values = [
    record.symbol,
    record.name,
    record.type,
    record.region,
    record.market_open,
    record.market_close,
    record.timezone,
    record.currency,
  ];
  const result = await db.query(insertQuery, values);
  res.status(201).json({ message: "Added to watchlist successfully" });
});

//@desc Get Stocks Detail
//@route GET /api/watchlist/:id
//@access public
const getStockDetail = asyncHandler(async (req, res) => {
  const symbol = req.params.id.toUpperCase();
  const baseUrl = "https://www.alphavantage.co/query";

  const quoteParams = {
    function: "GLOBAL_QUOTE",
    symbol,
    apikey: API_KEY,
  };

  const tsParams = {
    function: "TIME_SERIES_DAILY",
    symbol,
    apikey: API_KEY,
  };

  const [quoteRes, tsRes] = await Promise.all([
    axios.get(baseUrl, { params: quoteParams }),
    axios.get(baseUrl, { params: tsParams }),
  ]);

  const quote = quoteRes.data["Global Quote"];
  const ts = tsRes.data["Time Series (Daily)"];

  if (!quote || !quote["05. price"] || !ts) {
    res.status(404);
    throw new Error(`Data not found for symbol ${symbol}`);
  }

  // Process graphData: map date ➝ closing price
  const graphData = Object.entries(ts)
    .slice(0, 7) // last 7 days
    .reverse();

  res.status(200).json({ detail: quote, graphData });
});

//@desc update stock deatils
//@route PUT /api/watchlist/:id
//@access public
const updateStock = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  const { "1. symbol": symbol, "2. name": name, category } = data;

  if (!symbol || !name || !category) {
    res.status(400);
    throw new Error(
      "Fields '1. symbol', '2. name', and 'category' are required."
    );
  }

  const query = `
      UPDATE watchlist
      SET symbol = $1,
          name = $2,
          category = $3
      WHERE id = $4
      RETURNING *;
    `;

  const values = [symbol, name, category, id];

  const result = await db.query(query, values);
  if (result.rows.length === 0) {
    res.status(404);
    throw new Error(`Stock with id ${id} not found`);
  }

  res.status(200).json(result.rows[0]);
});

//@desc Delete a stock from watchlist
//@route DELETE /api/watchlist/:id
//@access public
const deleteStock = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Attempt to delete the record
  const result = await db.query(
    "DELETE FROM watchlist WHERE id = $1 RETURNING *",
    [id]
  );

  if (result.rows.length === 0) {
    res.status(404);
    throw new Error(`Stock with id ${id} not found`);
  }

  res.status(200).json({
    message: `Deleted stock with id ${result.rows[0].symbol} - ${result.rows[0].name}`,
  });
});

module.exports = {
  getWatchlist,
  addToWatchlist,
  getStockDetail,
  updateStock,
  deleteStock,
};
