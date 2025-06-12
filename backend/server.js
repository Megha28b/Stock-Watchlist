require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

// Allow CORS from all origins
app.use(cors()); // 👈 this enables access from ANY origin

// or to allow all with credentials (optional)
app.use(
  cors({
    origin: "*", // 👈 allows all origins
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/watchlist/", require("./routes/watchlistRoute"));
app.use("/api/stocks", require("./routes/stocksRoute"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
