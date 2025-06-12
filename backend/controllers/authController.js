const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    username,
    hash,
  ]);
  res.status(201).json({ message: "User registered" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const result = await db.query(
    "SELECT id, password FROM users WHERE username = $1",
    [username]
  );
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  res.json({ token });
});

module.exports = { registerUser, loginUser };
