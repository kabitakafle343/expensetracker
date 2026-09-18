const jwt = require("jsonwebtoken");
exports.userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or invalid" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SCRETEKEY);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
