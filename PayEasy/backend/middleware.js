//Aata hi nhi tha
const jwt = require("jsonwebtoken");
const jwt_sec = require("./config");

export default function authMiddleware(req, res, next) {
  const authHead = req.headers.authorization;
  if (!authHead || !authHead.startsWith("Bearer")) {
    return res.status(403).json({});
  }

  const token = authHead.split(" ")[1];
  try {
    const decoded = jwt.verify(token, jwt_sec);
    if (decoded) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({});
    }
  } catch (error) {
    return res.status(403).json({});
  }
}
