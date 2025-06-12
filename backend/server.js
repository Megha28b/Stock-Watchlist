require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const port = process.env.PORT || 5001;

app.use(express.json());
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/watchlist/", require("./routes/watchlistRoute"));
app.use("/api/stocks", require("./routes/stocksRoute"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
