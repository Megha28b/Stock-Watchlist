const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Missing or invalid token");
  }
  const token = auth.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401);
    throw new Error("Token verification failed");
  }
};
