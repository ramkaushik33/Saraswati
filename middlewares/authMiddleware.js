// middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err && err.name === 'TokenExpiredError') {
        return res.status(401).send('Unauthorized: Token has expired');
      } else if (err) {
        return res.status(401).send('Unauthorized: Invalid token');
      }
      console.log(decoded); // Token is valid
    });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = auth;