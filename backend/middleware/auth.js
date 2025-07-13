const jwt = require("jsonwebtoken");
const SECRET = "your_jwt_secret"; // Change to your real secret

module.exports = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth) return next();
  const token = auth.split(" ")[1];
  try {
    const user = jwt.verify(token, SECRET);
    req.user = user;
  } catch (e) {
    // Invalid token, ignore
  }
  next();
};
